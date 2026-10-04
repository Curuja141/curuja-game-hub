import { CursorTrail } from "@/components/portfolio/CursorTrail";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/portfolio/Navbar";
import { Hero } from "@/components/portfolio/Hero";
import { Portfolio } from "@/components/portfolio/Portfolio";
import { Skills } from "@/components/portfolio/Skills";
import { Services } from "@/components/portfolio/Services";
import { Process } from "@/components/portfolio/Process";
import { About } from "@/components/portfolio/About";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";
import { RevealObserver } from "@/components/portfolio/GamePieces";
import { CinemaProvider } from "@/components/portfolio/Cinema";
import { PointerEffects } from "@/components/portfolio/PointerEffects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Curuja | Video Editor for Gaming & Creators" },
      { name: "description", content: "Curuja turns raw footage into punchy gaming edits, short-form content, YouTube videos, and motion graphics. Explore the work and start a project." },
      { property: "og:title", content: "Curuja | Video Editor for Gaming & Creators" },
      { property: "og:description", content: "Game-ready video edits for creators. Explore Curuja's portfolio and start a project." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});
function Index() {
  const [selectedService, setSelectedService] = useState("");
  return <CinemaProvider><PointerEffects/><CursorTrail/><RevealObserver/><Navbar/><main><Hero/><Portfolio/><Skills/><Services onSelect={setSelectedService}/><Process/><About/><Contact selectedService={selectedService}/></main><Footer/><Toaster position="bottom-right" richColors /></CinemaProvider>;
}
