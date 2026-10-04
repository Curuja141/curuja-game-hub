import { useEffect, useRef } from "react";

const COLORS = ["#ffe14a", "#ff7a59", "#8b69ff", "#7dffb3", "#fff6e8"];

type Bit = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  spin: number;
  rot: number;
};

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bits: Bit[] = [];
    const mouse = { x: 0, y: 0, seen: false };
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = (x: number, y: number, burst = false) => {
      const count = burst ? 10 : 1;
      for (let i = 0; i < count; i++) {
        if (bits.length > 90) bits.shift();
        const angle = Math.random() * Math.PI * 2;
        const speed = burst ? 1.4 + Math.random() * 2.4 : 0.3 + Math.random() * 0.8;
        bits.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - (burst ? 0.6 : 0.15),
          life: 1,
          size: burst ? 5 + Math.random() * 4 : 3 + Math.random() * 3,
          color: COLORS[(Math.random() * COLORS.length) | 0],
          spin: (Math.random() - 0.5) * 0.25,
          rot: Math.random() * Math.PI,
        });
      }
    };

    const frame = () => {
      raf = 0;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (let i = bits.length - 1; i >= 0; i--) {
        const bit = bits[i];
        bit.x += bit.vx;
        bit.y += bit.vy;
        bit.vy += 0.035;
        bit.vx *= 0.985;
        bit.life -= 0.018;
        bit.rot += bit.spin;
        if (bit.life <= 0) {
          bits.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = bit.life;
        ctx.translate(bit.x, bit.y);
        ctx.rotate(bit.rot);
        ctx.fillStyle = bit.color;
        ctx.fillRect(-bit.size / 2, -bit.size / 2, bit.size, bit.size);
        ctx.restore();
      }
      if (bits.length) raf = requestAnimationFrame(frame);
      else running = false;
    };

    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      if (!mouse.seen) {
        mouse.seen = true;
        lastX = mouse.x;
        lastY = mouse.y;
      }
      const dx = mouse.x - lastX;
      const dy = mouse.y - lastY;
      if (dx * dx + dy * dy > 36) {
        spawn(mouse.x, mouse.y);
        lastX = mouse.x;
        lastY = mouse.y;
        wake();
      }
    };

    const onDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      spawn(event.clientX, event.clientY, true);
      wake();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />;
}
