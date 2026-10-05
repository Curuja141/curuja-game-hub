import { useEffect, useState, type MouseEvent } from "react";
import { Heart, Menu, X } from "lucide-react";
import { navItems } from "@/data/site";
import { ArcadeButton, OwlMascot } from "./GamePieces";

export function Navbar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const update = () => {
      const marker = window.scrollY + 170;
      let current = "home";
      for (const item of navItems) {
        const node = document.getElementById(item.href.slice(1));
        if (node && node.offsetTop <= marker) current = item.href.slice(1);
      }
      setActive(current);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  // The hover pop is a CSS animation; when it is removed the tab would snap back to normal size,
  // so we play a short "nav-out" tail instead. Clearing the class on enter keeps re-hovers crisp.
  const clearPop = (e: MouseEvent<HTMLAnchorElement>) => e.currentTarget.classList.remove("nav-out");
  const playPopOut = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    el.classList.add("nav-out");
    window.setTimeout(() => el.classList.remove("nav-out"), 430);
  };
  return <header className="site-nav">
    <div className="nav-inner">
      <a href="#home" className="brand" aria-label="Curuja, back to start" onClick={() => setOpen(false)}><OwlMascot id="nav-owl" /><span>CURUJA</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{navItems.map(item => <a key={item.label} href={item.href} className={active === item.href.slice(1) ? "active" : ""} aria-current={active === item.href.slice(1) ? "location" : undefined} onMouseEnter={clearPop} onMouseLeave={playPopOut}>{item.label}</a>)}</nav>
      <div className="nav-actions"><span className="nav-lives" aria-label="Three lives"><Heart fill="currentColor"/><Heart fill="currentColor"/><Heart fill="currentColor"/></span><ArcadeButton asChild className="nav-hire"><a href="#contact">HIRE ME <span aria-hidden="true">↗</span></a></ArcadeButton><ArcadeButton className="menu-toggle" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</ArcadeButton></div>
    </div>
    {open && <nav id="mobile-menu" className="pause-menu" aria-label="Mobile navigation"><span className="pixel-label">// PAUSE MENU</span>{navItems.map(item => <a key={item.label} href={item.href} onClick={() => setOpen(false)} onMouseEnter={clearPop} onMouseLeave={playPopOut} className={active === item.href.slice(1) ? "active" : ""}>{item.label} <span aria-hidden="true">↗</span></a>)}</nav>}
  </header>;
}
