import { useEffect, useRef } from "react";

// A smooth glowing "comet" that follows the mouse: white at the head, fading to purple at the tail.
// The head eases toward the real pointer and every point is timed, so it looks the same on 60 Hz and 144 Hz screens.
// A soft ripple expands where you click. Touch screens never fire mouse events, so nothing runs there.
// If the system asks for reduced motion, the trail stays but is shorter and the click ripple is off.

type Point = { x: number; y: number; t: number };
type Ripple = { x: number; y: number; t: number };

const LIFE = 520; // how long a trail point lives (ms)
const LIFE_CALM = 300;
const RIPPLE = 560;
const HEAD_RADIUS = 5.2;
const COVERED = "[role='dialog'], video[controls]";

const mix = (a: number, b: number, k: number) => a + (b - a) * k;
// head: white -> lilac -> purple
const color = (k: number): [number, number, number] =>
  k < 0.5
    ? [mix(255, 196, k * 2), mix(255, 176, k * 2), 255]
    : [mix(196, 124, (k - 0.5) * 2), mix(176, 92, (k - 0.5) * 2), mix(255, 224, (k - 0.5) * 2)];

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const calmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const points: Point[] = [];
    const ripples: Ripple[] = [];
    const mouse = { x: 0, y: 0, seen: false, covered: false };
    const head = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const frame = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(now - last, 50) : 16.7;
      last = now;
      const life = calmQuery.matches ? LIFE_CALM : LIFE;

      // the head glides toward the pointer (frame-rate independent easing)
      if (mouse.seen && !mouse.covered) {
        const k = 1 - Math.pow(1 - 0.38, dt / 16.7);
        head.x += (mouse.x - head.x) * k;
        head.y += (mouse.y - head.y) * k;
        const tail = points[points.length - 1];
        if (!tail || Math.hypot(head.x - tail.x, head.y - tail.y) > 0.6) points.push({ x: head.x, y: head.y, t: now });
      }
      while (points.length && now - (points[0] as Point).t > life) points.shift();
      while (ripples.length && now - (ripples[0] as Ripple).t > RIPPLE) ripples.shift();

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      if (points.length > 1) {
        // smooth the polyline with quadratic curves through the midpoints, then stamp soft dots along it
        const stamp = (x: number, y: number, t: number) => {
          const age = Math.min(Math.max((now - t) / life, 0), 1);
          const fade = Math.pow(1 - age, 1.7);
          const [r, g, b] = color(age);
          const radius = HEAD_RADIUS * Math.pow(1 - age, 0.75) + 0.4;
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${(0.16 * fade).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(x, y, radius * 2.6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${(0.85 * fade).toFixed(3)})`;
          ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
        };
        for (let i = 1; i < points.length; i++) {
          const p0 = points[i - 1] as Point;
          const p1 = points[i] as Point;
          const p2 = (points[i + 1] ?? p1) as Point;
          const ax = (p0.x + p1.x) / 2, ay = (p0.y + p1.y) / 2;
          const bx = (p1.x + p2.x) / 2, by = (p1.y + p2.y) / 2;
          const length = Math.hypot(bx - ax, by - ay);
          const steps = Math.max(1, Math.ceil(length / 2.2));
          for (let s = 0; s < steps; s++) {
            const u = s / steps;
            const x = (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * p1.x + u * u * bx;
            const y = (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * p1.y + u * u * by;
            stamp(x, y, mix(p0.t, p2.t, 0.5 + (u - 0.5) * 0.5));
          }
        }
      }

      if (!calmQuery.matches) {
        ripples.forEach(ripple => {
          const k = Math.min(Math.max((now - ripple.t) / RIPPLE, 0), 1); // a click can land a few ms after the frame timestamp
          const eased = 1 - Math.pow(1 - k, 3);
          ctx.strokeStyle = `rgba(196, 176, 255, ${(0.55 * (1 - k)).toFixed(3)})`;
          ctx.lineWidth = 2.2 * (1 - k) + 0.4;
          ctx.beginPath(); ctx.arc(ripple.x, ripple.y, 6 + 44 * eased, 0, Math.PI * 2); ctx.stroke();
        });
      }
      ctx.globalCompositeOperation = "source-over";

      const settled = !mouse.seen || mouse.covered || Math.hypot(mouse.x - head.x, mouse.y - head.y) < 0.4;
      if (points.length || ripples.length || !settled) raf = requestAnimationFrame(frame);
      else last = 0;
    };
    const wake = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      mouse.covered = !!(event.target as Element | null)?.closest(COVERED);
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (!mouse.seen) { mouse.seen = true; head.x = mouse.x; head.y = mouse.y; }
      wake();
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch" || calmQuery.matches) return;
      if ((event.target as Element | null)?.closest(COVERED)) return;
      ripples.push({ x: event.clientX, y: event.clientY, t: performance.now() });
      wake();
    };
    const onLeave = () => { mouse.seen = false; wake(); };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
}
