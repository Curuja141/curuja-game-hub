import { useEffect, useRef } from "react";

// Mouse-tracking effects for desktop: a soft purple glow that follows the cursor, a trailing ring that
// grows over things you can click (and says PLAY over videos), and a 3D tilt with a light reflection on cards.
// Nothing here runs on touch screens or when the visitor asked for reduced motion.

type TiltRule = { selector: string; max: number; scale: number };
const TILT_RULES: TiltRule[] = [
  { selector: ".video-thumb", max: 9, scale: 1.025 },
  { selector: ".service-card", max: 6, scale: 1.02 },
  { selector: ".achievement:not(.locked)", max: 5, scale: 1.02 },
];
const PLAYABLE = ".video-thumb, .tv-hit";
const TEXT_FIELDS = "input:not([type='checkbox']):not([type='radio']), textarea";
const CLICKABLE = "a, button, [role='button'], summary, select, label";
const COVERED = "[role='dialog'], video[controls]";
const STIFFNESS = 170;
const DAMPING = 17;

type Tilt = {
  el: HTMLElement; rule: TiltRule;
  rx: number; ry: number; s: number; o: number;
  vrx: number; vry: number; vs: number; vo: number;
  tRx: number; tRy: number; tS: number; tO: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function PointerEffects() {
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const ring = ringRef.current;
    if (!glow || !ring) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mouse = { x: 0, y: 0, seen: false };
    const glowPos = { x: 0, y: 0 };
    const ringPos = { x: 0, y: 0 };
    const tilts = new Map<HTMLElement, Tilt>();
    let host: HTMLElement | null = null;
    let raf = 0;
    let last = 0;

    const release = (tilt: Tilt) => { tilt.tRx = 0; tilt.tRy = 0; tilt.tS = 1; tilt.tO = 0; };
    const clean = (el: HTMLElement) => {
      el.removeAttribute("data-tilting");
      ["--tilt-rx", "--tilt-ry", "--tilt-s", "--glare-o", "--glare-x", "--glare-y"].forEach(name => el.style.removeProperty(name));
    };

    const retarget = (target: Element | null) => {
      const covered = !target || !!target.closest(COVERED);
      let next: { el: HTMLElement; rule: TiltRule } | null = null;
      if (target && !covered) {
        for (const rule of TILT_RULES) {
          const el = target.closest<HTMLElement>(rule.selector);
          if (el) { next = { el, rule }; break; }
        }
      }
      tilts.forEach((tilt, el) => { if (!next || next.el !== el) release(tilt); });
      host = next ? next.el : null;
      if (next && !tilts.has(next.el)) {
        next.el.setAttribute("data-tilting", "");
        tilts.set(next.el, { el: next.el, rule: next.rule, rx: 0, ry: 0, s: 1, o: 0, vrx: 0, vry: 0, vs: 0, vo: 0, tRx: 0, tRy: 0, tS: 1, tO: 0 });
      }
      ring.setAttribute("data-kind", covered ? "hidden" : target.closest(PLAYABLE) ? "video" : target.closest(TEXT_FIELDS) ? "text" : target.closest(CLICKABLE) ? "link" : "default");
    };

    const aim = () => {
      const tilt = host ? tilts.get(host) : undefined;
      if (!host || !tilt) return;
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = clamp(((mouse.x - rect.left) / rect.width) * 2 - 1, -1, 1);
      const ny = clamp(((mouse.y - rect.top) / rect.height) * 2 - 1, -1, 1);
      tilt.tRy = nx * tilt.rule.max;
      tilt.tRx = -ny * tilt.rule.max;
      tilt.tS = tilt.rule.scale;
      tilt.tO = 1;
      host.style.setProperty("--glare-x", `${(mouse.x - rect.left).toFixed(1)}px`);
      host.style.setProperty("--glare-y", `${(mouse.y - rect.top).toFixed(1)}px`);
    };

    const spring = (x: number, v: number, target: number, dt: number): [number, number] => {
      const acceleration = STIFFNESS * (target - x) - DAMPING * v;
      const nextV = v + acceleration * dt;
      return [x + nextV * dt, nextV];
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;
      const glowK = 1 - Math.pow(1 - 0.09, dt * 60);
      const ringK = 1 - Math.pow(1 - 0.24, dt * 60);
      glowPos.x += (mouse.x - glowPos.x) * glowK;
      glowPos.y += (mouse.y - glowPos.y) * glowK;
      ringPos.x += (mouse.x - ringPos.x) * ringK;
      ringPos.y += (mouse.y - ringPos.y) * ringK;
      glow.style.transform = `translate3d(${glowPos.x.toFixed(1)}px, ${glowPos.y.toFixed(1)}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x.toFixed(1)}px, ${ringPos.y.toFixed(1)}px, 0)`;
      let busy = Math.abs(mouse.x - glowPos.x) > 0.4 || Math.abs(mouse.y - glowPos.y) > 0.4 || Math.abs(mouse.x - ringPos.x) > 0.4 || Math.abs(mouse.y - ringPos.y) > 0.4;

      tilts.forEach((tilt, el) => {
        for (let i = 0; i < 2; i++) {
          [tilt.rx, tilt.vrx] = spring(tilt.rx, tilt.vrx, tilt.tRx, dt / 2);
          [tilt.ry, tilt.vry] = spring(tilt.ry, tilt.vry, tilt.tRy, dt / 2);
          [tilt.s, tilt.vs] = spring(tilt.s, tilt.vs, tilt.tS, dt / 2);
          [tilt.o, tilt.vo] = spring(tilt.o, tilt.vo, tilt.tO, dt / 2);
        }
        const settled = Math.abs(tilt.rx - tilt.tRx) < 0.02 && Math.abs(tilt.ry - tilt.tRy) < 0.02 && Math.abs(tilt.s - tilt.tS) < 0.0004 && Math.abs(tilt.o - tilt.tO) < 0.004
          && Math.abs(tilt.vrx) < 0.05 && Math.abs(tilt.vry) < 0.05 && Math.abs(tilt.vs) < 0.002 && Math.abs(tilt.vo) < 0.02;
        if (settled && tilt.tO === 0) { clean(el); tilts.delete(el); return; }
        el.style.setProperty("--tilt-rx", `${tilt.rx.toFixed(3)}deg`);
        el.style.setProperty("--tilt-ry", `${tilt.ry.toFixed(3)}deg`);
        el.style.setProperty("--tilt-s", tilt.s.toFixed(4));
        el.style.setProperty("--glare-o", clamp(tilt.o, 0, 1).toFixed(3));
        if (!settled) busy = true;
      });

      if (busy) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (!mouse.seen) {
        mouse.seen = true;
        glowPos.x = ringPos.x = mouse.x;
        glowPos.y = ringPos.y = mouse.y;
        glow.setAttribute("data-on", "");
        ring.setAttribute("data-on", "");
      }
      retarget(event.target as Element | null);
      aim();
      wake();
    };
    const onScroll = () => {
      if (!mouse.seen) return;
      retarget(document.elementFromPoint(mouse.x, mouse.y));
      aim();
      wake();
    };
    const onLeave = () => {
      mouse.seen = false;
      glow.removeAttribute("data-on");
      ring.removeAttribute("data-on");
      tilts.forEach(release);
      host = null;
      wake();
    };
    const onDown = () => { ring.setAttribute("data-down", ""); };
    const onUp = () => { ring.removeAttribute("data-down"); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      tilts.forEach((_, el) => clean(el));
      tilts.clear();
    };
  }, []);

  return <>
    <div ref={glowRef} className="cursor-glow" aria-hidden="true"/>
    <div ref={ringRef} className="cursor-ring" aria-hidden="true"><span className="cursor-ring-shape"/><span className="cursor-ring-label">PLAY</span></div>
  </>;
}
