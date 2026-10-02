import { Flag, MessageSquare, Send, Video } from "lucide-react";
import { processSteps } from "@/data/site";
import { SectionHeading } from "./GamePieces";
const icons = [Send, Video, MessageSquare, Flag];
export function Process() { return <section id="process" className="process-section section-pad"><div className="page-container"><SectionHeading eyebrow="// QUEST LOG" title="HOW THE GAME WORKS" subtitle="From your footage to the final boss-level edit."/><div className="process-path">{processSteps.map((step, index) => { const Icon = icons[index] ?? Flag; return <div className="process-step reveal" key={step.title}><div className="checkpoint"><Icon size={28}/></div><div className="process-copy"><span className="pixel-label">CHECKPOINT 0{index + 1}</span><h3>{step.title}</h3><p>{step.description}</p></div></div>; })}</div></div></section>; }
