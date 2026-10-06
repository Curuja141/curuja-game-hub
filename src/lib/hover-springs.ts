// Premium hover for the interaction boxes (cards, buttons, contact links...), driven by real spring physics.
//
//  - Entering: the box grows ~2-4% and the text inside grows ~7%, each with its own spring (mass + stiffness + damping).
//    The spring overshoots a little and settles. This is a physical simulation, not a CSS easing curve.
//  - Leaving: a slightly over-damped spring brings everything back to 1 without a second bounce.
//  - Only the standalone `scale` property is animated, so layout, fonts and sizes never change and the existing
//    transform-based effects (3D tilt, tab pill) keep working.
//  - The loop runs only while something is moving and goes to sleep when the mouse is still.
//  - Nothing runs for touch input or when the system asks for reduced motion.

type SpringParams = { stiffness: number; damping: number; mass: number };

const ENTER: SpringParams = { stiffness: 400, damping: 12, mass: 0.6 }; // damping ratio ~0.39 -> small, quick overshoot
const ENTER_TEXT: SpringParams = { stiffness: 340, damping: 11, mass: 0.6 }; // a touch softer: the text trails the box
const EXIT: SpringParams = { stiffness: 420, damping: 2 * 1.1 * Math.sqrt(420 * 0.6), mass: 0.6 }; // damping ratio 1.1 -> no bounce

const BOX_SELECTOR = [
  ".arcade-button", ".nav-hire", ".tv-channel", ".tv-watch", ".cinema-item", ".video-card", ".service-card",
  ".achievement:not(.locked)", ".process-copy", ".inventory-slot.filled", ".contact-links a",
].join(", ");
const TEXT_SCALE = 1.07;
const EDGE = 6; // text may never get closer than this to the box edge (px)
const SAFE_TRANSITIONS = "color, background-color, border-color, box-shadow, opacity, filter, transform, translate";

// Exact (analytic) spring step: works for any frame time, so it behaves the same on 60 Hz and 144 Hz screens.
export function stepSpring(x: number, v: number, target: number, p: SpringParams, dt: number): [number, number] {
  const w0 = Math.sqrt(p.stiffness / p.mass);
  const z = p.damping / (2 * Math.sqrt(p.stiffness * p.mass));
  const d0 = x - target;
  if (z < 0.999) {
    const wd = w0 * Math.sqrt(1 - z * z);
    const e = Math.exp(-z * w0 * dt);
    const b = (v + z * w0 * d0) / wd;
    const cos = Math.cos(wd * dt);
    const sin = Math.sin(wd * dt);
    return [target + e * (d0 * cos + b * sin), e * ((b * wd - z * w0 * d0) * cos - (d0 * wd + z * w0 * b) * sin)];
  }
  if (z < 1.001) {
    const e = Math.exp(-w0 * dt);
    const k = v + w0 * d0;
    return [target + e * (d0 + k * dt), e * (v - w0 * k * dt)];
  }
  const s = Math.sqrt(z * z - 1);
  const r1 = -w0 * (z - s);
  const r2 = -w0 * (z + s);
  const c2 = (v - r1 * d0) / (r2 - r1);
  const c1 = d0 - c2;
  const e1 = Math.exp(r1 * dt);
  const e2 = Math.exp(r2 * dt);
  return [target + c1 * e1 + c2 * e2, c1 * r1 * e1 + c2 * r2 * e2];
}

type Item = {
  el: HTMLElement;
  owner: HTMLElement | null; // the box a text part belongs to (null for boxes)
  x: number;
  v: number;
  target: number;
  params: SpringParams;
  text: boolean;
  swappedTransitions: boolean;
};

const layoutLeft = (el: HTMLElement): number => {
  let x = 0;
  let node: HTMLElement | null = el;
  while (node) {
    x += node.offsetLeft;
    const parent = node.offsetParent as HTMLElement | null;
    if (parent) x += parent.clientLeft;
    node = parent;
  }
  return x;
};

const hasOwnText = (el: Element) => Array.from(el.childNodes).some(node => node.nodeType === 3 && (node.textContent ?? "").trim() !== "");
const isTextBearing = (el: Element) => (el.textContent ?? "").trim() !== "";

export function startHoverSprings(): () => void {
  const calmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const items = new Map<HTMLElement, Item>();
  const hovered = new Set<HTMLElement>();
  const pointer = { x: 0, y: 0, seen: false };
  let raf = 0;
  let last = 0;

  const isBox = (el: Element) => el.matches(BOX_SELECTOR);

  const boxScale = (box: HTMLElement) => (box.offsetWidth <= 200 ? 1.04 : box.offsetWidth <= 560 ? 1.03 : 1.02);

  // The text elements inside a box that can be scaled on their own without touching the layout.
  const findParts = (box: HTMLElement): HTMLElement[] => {
    const out: HTMLElement[] = [];
    const visit = (node: Element) => {
      Array.from(node.children).forEach(child => {
        if (!(child instanceof HTMLElement) || isBox(child)) return; // SVG icons and nested boxes handle themselves
        const css = getComputedStyle(child);
        if (css.display === "none" || css.display === "contents") return;
        const rowFlex = (css.display === "flex" || css.display === "inline-flex") && css.flexDirection.startsWith("row");
        const ownsText = hasOwnText(child) || (rowFlex && child.children.length > 1 && Array.from(child.children).every(isTextBearing));
        if (!ownsText) { visit(child); return; }
        const transformable = css.display !== "inline" && css.position !== "absolute" && css.position !== "fixed";
        if (transformable && !/icon/i.test(child.className.toString())) out.push(child);
      });
    };
    visit(box);
    return out;
  };

  const originOf = (el: HTMLElement) => {
    const align = getComputedStyle(el).textAlign;
    return align === "center" ? "center center" : align === "right" || align === "end" ? "right center" : "left center";
  };

  // Largest scale the text can reach while staying inside the box (measured from layout, so it ignores running animations).
  const textPeak = (part: HTMLElement, box: HTMLElement, origin: string) => {
    const width = part.offsetWidth;
    if (!width) return 1;
    const left = layoutLeft(part) - layoutLeft(box);
    const rightRoom = box.offsetWidth - left - width - EDGE;
    const leftRoom = left - EDGE;
    const room = origin.startsWith("center") ? Math.min(leftRoom, rightRoom) * 2 : origin.startsWith("right") ? leftRoom : rightRoom;
    return Math.max(1, Math.min(TEXT_SCALE, 1 + room / width));
  };

  const ensure = (el: HTMLElement, owner: HTMLElement | null, text: boolean): Item => {
    const existing = items.get(el);
    if (existing) return existing;
    const item: Item = { el, owner, x: 1, v: 0, target: 1, params: ENTER, text, swappedTransitions: false };
    const transition = getComputedStyle(el).transitionProperty;
    if (/\ball\b|\bscale\b/.test(transition)) { el.style.transitionProperty = SAFE_TRANSITIONS; item.swappedTransitions = true; } // CSS must not smooth the spring
    el.style.willChange = "scale";
    items.set(el, item);
    return item;
  };

  const enter = (box: HTMLElement) => {
    const item = ensure(box, null, false);
    item.params = ENTER;
    item.target = boxScale(box);
    findParts(box).forEach(part => {
      const origin = originOf(part);
      part.style.transformOrigin = origin;
      const partItem = ensure(part, box, true);
      partItem.owner = box;
      partItem.params = ENTER_TEXT;
      partItem.target = textPeak(part, box, origin);
    });
    wake();
  };

  const leave = (box: HTMLElement) => {
    items.forEach(item => {
      if (item.el === box || item.owner === box) { item.params = EXIT; item.target = 1; }
    });
    wake();
  };

  const release = (item: Item) => {
    const style = item.el.style;
    style.removeProperty("scale");
    style.removeProperty("will-change");
    if (item.text) style.removeProperty("transform-origin");
    if (item.swappedTransitions) style.removeProperty("transition-property");
    items.delete(item.el);
  };

  const frame = (now: number) => {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    let busy = false;
    Array.from(items.values()).forEach(item => {
      [item.x, item.v] = stepSpring(item.x, item.v, item.target, item.params, dt);
      const resting = Math.abs(item.x - item.target) < 0.0004 && Math.abs(item.v) < 0.02;
      if (resting) { item.x = item.target; item.v = 0; }
      if (resting && item.target === 1) { release(item); return; }
      item.el.style.scale = item.x.toFixed(4);
      if (!resting) busy = true;
    });
    if (busy) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

  const retarget = (target: Element | null) => {
    const next = new Set<HTMLElement>();
    if (!calmQuery.matches) {
      for (let node: Element | null = target; node; node = node.parentElement) {
        if (node instanceof HTMLElement && isBox(node) && !node.matches(":disabled, [aria-disabled='true']")) next.add(node);
      }
    }
    hovered.forEach(box => { if (!next.has(box)) leave(box); });
    next.forEach(box => { if (!hovered.has(box)) enter(box); });
    hovered.clear();
    next.forEach(box => hovered.add(box));
  };

  const onOver = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.seen = true;
    retarget(event.target as Element | null);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.seen = true;
  };
  const onScroll = () => { if (pointer.seen) retarget(document.elementFromPoint(pointer.x, pointer.y)); };
  const onLeave = () => { pointer.seen = false; retarget(null); };

  document.addEventListener("pointerover", onOver, { passive: true });
  document.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.documentElement.addEventListener("mouseleave", onLeave);
  return () => {
    document.removeEventListener("pointerover", onOver);
    document.removeEventListener("pointermove", onMove);
    window.removeEventListener("scroll", onScroll);
    document.documentElement.removeEventListener("mouseleave", onLeave);
    if (raf) cancelAnimationFrame(raf);
    Array.from(items.values()).forEach(release);
    hovered.clear();
  };
}
