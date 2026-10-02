import { useEffect, useRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ArcadeButton({ className, ...props }: ButtonProps) {
  return <Button {...props} className={cn("arcade-button", className)} />;
}

export function SectionHeading({ eyebrow, title, subtitle, light = false }: { eyebrow: string; title: string; subtitle?: string; light?: boolean }) {
  return <div className={cn("section-heading reveal", light && "section-heading-light")}>
    <span className="pixel-label">{eyebrow}</span>
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </div>;
}

export function RevealObserver() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.IntersectionObserver) {
      nodes.forEach(node => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.08, rootMargin: "0px 0px 40px 0px" });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return null;
}

export function OwlMascot({ className = "", id = "owl" }: { className?: string; id?: string }) {
  // An original geometric mascot; no third-party character or brand artwork.
  return <svg className={className} viewBox="0 0 340 340" role="img" aria-labelledby={`${id}-title`} xmlns="http://www.w3.org/2000/svg">
    <title id={`${id}-title`}>Curuja, a cheerful cartoon owl wearing headphones</title>
    <g stroke="var(--ink)" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round">
      <path d="M83 127 69 46l69 39c20-7 45-7 64 0l69-39-14 81c22 25 34 56 34 90 0 72-54 113-121 113S49 289 49 217c0-34 12-65 34-90Z" fill="var(--sunny)"/>
      <path d="M87 118c-22 4-42 27-44 58l-10 54c-6 27 5 43 26 45l28-8" fill="var(--grape)"/>
      <path d="M253 118c22 4 42 27 44 58l10 54c6 27-5 43-26 45l-28-8" fill="var(--grape)"/>
      <path d="M68 119c2-62 43-101 102-101s100 39 102 101" fill="none" strokeWidth="16"/>
      <path d="M75 153c-12 0-22 10-22 22v48c0 12 10 22 22 22h13v-92H75Z" fill="var(--coral)"/>
      <path d="M265 153c12 0 22 10 22 22v48c0 12-10 22-22 22h-13v-92h13Z" fill="var(--coral)"/>
      <path d="M167 162c-8-20-26-30-45-30-29 0-48 22-48 51s21 50 48 50c24 0 43-15 48-36 5 21 24 36 48 36 27 0 48-21 48-50s-19-51-48-51c-19 0-37 10-45 30Z" fill="var(--cream)"/>
      <circle cx="124" cy="184" r="12" fill="var(--ink)" stroke="none"/><circle cx="216" cy="184" r="12" fill="var(--ink)" stroke="none"/>
      <circle cx="128" cy="179" r="4" fill="var(--cream)" stroke="none"/><circle cx="220" cy="179" r="4" fill="var(--cream)" stroke="none"/>
      <path d="m153 213 17 22 17-22Z" fill="var(--coral)"/>
      <path d="M126 253c12 18 25 27 44 27s32-9 44-27" fill="none"/>
      <path d="M103 306c-5 11-3 19 4 22m20-22c-4 11-1 19 7 22m79-22c-5 11-3 19 4 22m20-22c-4 11-1 19 7 22" fill="none"/>
    </g>
    <path d="m119 95 7 13 14 2-10 10 3 14-14-7-13 7 2-14-10-10 14-2Z" fill="var(--cream)"/>
  </svg>;
}

export function PixelDivider({ className = "" }: { className?: string }) {
  return <div className={cn("pixel-divider", className)} aria-hidden="true" />;
}

export function useActiveSection(ids: string[]) {
  const activeRef = useRef("home");
  const setRef = useRef<(id: string) => void>(() => {});
  useEffect(() => {
    const onScroll = () => {
      const marker = window.scrollY + 150;
      let current = ids[0] ?? "home";
      for (const id of ids) {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= marker) current = id;
      }
      if (current !== activeRef.current) { activeRef.current = current; setRef.current(current); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);
  return setRef;
}
