import { Captions, Film, LockKeyhole, Palette, Scissors, Sparkles, Volume2 } from "lucide-react";
import { achievements, inventory } from "@/data/skills";
import { SectionHeading } from "./GamePieces";

const icons = { scissors: Scissors, sparkles: Sparkles, audio: Volume2, palette: Palette, captions: Captions, lock: LockKeyhole, film: Film };
export function Skills() {
  return <section id="skills" className="skills-section section-pad"><div className="page-container"><SectionHeading eyebrow="// SKILL TREE" title="ACHIEVEMENTS" subtitle="The tools and tricks behind every edit." light/><div className="achievement-grid">{achievements.map((skill, index) => { const Icon = icons[skill.icon]; return <div className={`achievement reveal ${skill.unlocked ? "" : "locked"}`} key={`${skill.title}-${index}`}><div className="medal"><Icon size={31} strokeWidth={2.5}/></div><div><span className="achievement-state">{skill.unlocked ? "✦ UNLOCKED" : "🔒 LOCKED"}</span><h3>{skill.title}</h3><p>{skill.description}</p></div></div>; })}</div><div className="inventory-block reveal"><div className="inventory-title"><span className="pixel-label">// EQUIPMENT</span><h3>INVENTORY <span aria-hidden="true">✦</span></h3></div><div className="inventory-slots">{inventory.map((item, index) => { const Icon = item.icon ? icons[item.icon] : null; return <div className={`inventory-slot ${item.name ? "filled" : "empty"}`} key={index} aria-label={item.name || "Empty inventory slot"}>{Icon ? <Icon size={30}/> : <span>+</span>}<small>{item.name || "EMPTY"}</small></div>; })}</div></div></div></section>;
}
