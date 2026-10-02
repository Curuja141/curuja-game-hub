import { Clapperboard, Gamepad2, Play, WandSparkles } from "lucide-react";
import { services } from "@/data/site";
import { ArcadeButton, SectionHeading } from "./GamePieces";

const icons = { game: Gamepad2, short: Play, video: Clapperboard, motion: WandSparkles };
export function Services({ onSelect }: { onSelect: (service: string) => void }) {
  return <section id="services" className="services-section section-pad"><div className="page-container"><SectionHeading eyebrow="// LOADOUT" title="CHOOSE YOUR PACK" subtitle="A custom edit for every kind of creator."/><div className="service-grid">{services.map((service, index) => { const Icon = icons[service.icon]; return <article className={`service-card reveal service-${index}`} key={service.title}><span className="service-number">PACK 0{index + 1}</span><div className="service-icon"><Icon size={43} strokeWidth={2.3}/></div><h3>{service.title}</h3><p>{service.description}</p><ArcadeButton className="service-cta" onClick={() => { onSelect(service.title); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}>GET A QUOTE <span aria-hidden="true">↗</span></ArcadeButton></article>; })}</div></div></section>;
}
