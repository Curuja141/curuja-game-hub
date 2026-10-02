import { useState } from "react";
import { Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { videos, type Video } from "@/data/videos";
import { ArcadeButton, SectionHeading } from "./GamePieces";

function VideoCard({ video, index, onOpen }: { video: Video; index: number; onOpen: (video: Video) => void }) {
  return <article className="video-card reveal sticker"><div className="video-thumb">{video.youtubeId ? <img src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt={`Thumbnail for ${video.title}`} loading="lazy"/> : <div className={`placeholder-art placeholder-art-${index % 3}`} aria-label="Video thumbnail placeholder"><span className="placeholder-sun"/><span className="placeholder-mountain"/><span className="placeholder-grid"/></div>}<span className="level-chip">LEVEL {video.id}</span><ArcadeButton className="play-button" aria-label={`Play ${video.title}`} onClick={() => onOpen(video)}><Play fill="currentColor" size={26}/></ArcadeButton></div><div className="video-details"><div><span className="video-category">{video.category}</span><h3>{video.title}</h3></div><ArcadeButton className="card-arrow" aria-label={`Open ${video.title}`} onClick={() => onOpen(video)}>↗</ArcadeButton></div></article>;
}

export function Portfolio() {
  const [category, setCategory] = useState("ALL");
  const [selected, setSelected] = useState<Video | null>(null);
  const categories = ["ALL", ...new Set(videos.map(video => video.category))];
  const filtered = category === "ALL" ? videos : videos.filter(video => video.category === category);
  return <section id="portfolio" className="portfolio-section halftone section-pad"><div className="page-container"><SectionHeading eyebrow="// LEVEL SELECT" title="SELECT YOUR LEVEL" subtitle="Pick a video and hit play."/><div className="filter-row" role="group" aria-label="Filter videos by category">{categories.map(item => <ArcadeButton key={item} className={`filter-button ${category === item ? "selected" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</ArcadeButton>)}</div><div className="video-grid">{filtered.map((video, index) => <VideoCard key={video.id} video={video} index={index} onOpen={setSelected}/>)}</div><p className="portfolio-note">MORE LEVELS COMING SOON <span aria-hidden="true">✦</span></p></div><Dialog open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}><DialogContent className="video-dialog" aria-describedby="video-description"><DialogTitle className="dialog-title">{selected?.title}</DialogTitle><DialogDescription id="video-description" className="dialog-description">{selected?.description || selected?.category}</DialogDescription><div className="dialog-video">{selected?.youtubeId ? <iframe src={`https://www.youtube-nocookie.com/embed/${selected.youtubeId}?autoplay=1`} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/> : <div className="dialog-placeholder"><Play size={44}/><p>VIDEO COMING SOON</p><span>Add a YouTube ID to play this project.</span></div>}</div><ArcadeButton className="button-sunny dialog-close" onClick={() => setSelected(null)}><X size={18}/> CLOSE</ArcadeButton></DialogContent></Dialog></section>;
}
