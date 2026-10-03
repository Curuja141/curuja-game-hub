import { useEffect, useRef, useState } from "react";
import { ListVideo, Play, Volume2 } from "lucide-react";
import { videos, type Video } from "@/data/videos";
import { ArcadeButton, SectionHeading } from "./GamePieces";
import { useCinema } from "./Cinema";

function VideoCard({ video, index }: { video: Video; index: number }) {
  const { open, isOpen } = useCinema();
  const cardRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);
  const [pointerOn, setPointerOn] = useState(false); // mouse is over the card, or it has keyboard focus
  const [inView, setInView] = useState(false); // touch screens: preview plays while the card is on screen
  const previewing = (pointerOn || inView) && !isOpen;

  useEffect(() => {
    const card = cardRef.current;
    if (!card || !("IntersectionObserver" in window)) return;
    const touchOnly = window.matchMedia("(hover: none)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!touchOnly || reduceMotion) return;
    const observer = new IntersectionObserver(entries => setInView((entries[0]?.intersectionRatio ?? 0) >= 0.7), { threshold: [0, 0.7, 1] });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    if (previewing) {
      element.play().catch(() => undefined);
    } else {
      element.pause();
      element.currentTime = 0;
    }
  }, [previewing]);

  return <article
    ref={cardRef}
    className="video-card reveal sticker"
    data-previewing={previewing ? "true" : undefined}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") setPointerOn(true); }}
    onPointerLeave={(event) => { if (event.pointerType === "mouse") setPointerOn(false); }}
    onFocus={() => setPointerOn(true)}
    onBlur={() => setPointerOn(false)}
    onClick={(event) => { if (!(event.target as HTMLElement).closest("button")) open(index); }}
  >
    <div className="video-thumb">
      <video ref={previewRef} className="preview-video" src={video.preview} poster={video.poster} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}/>
      <button type="button" className="video-open" onClick={() => open(index)} aria-label={`Watch ${video.title} with sound`}/>
      <span className="level-chip">LEVEL {video.id}</span>
      {index === 0 && <span className="video-flag">FEATURED</span>}
      <span className="play-badge" aria-hidden="true"><Play fill="currentColor" size={26}/></span>
      <span className="video-hint" aria-hidden="true"><Volume2 size={13}/> PLAY WITH SOUND</span>
      <span className="video-time">{video.duration}</span>
    </div>
    <div className="video-details"><div><span className="video-category">{video.category}</span><h3>{video.title}</h3>{video.description && <p className="video-blurb">{video.description}</p>}</div></div>
  </article>;
}

export function Portfolio() {
  const [category, setCategory] = useState("ALL");
  const { open } = useCinema();
  const categories = ["ALL", ...new Set(videos.map(video => video.category))];
  const filtered = category === "ALL" ? videos : videos.filter(video => video.category === category);
  return <section id="portfolio" className="portfolio-section halftone section-pad">
    <div className="page-container">
      <SectionHeading eyebrow="// LEVEL SELECT" title="SELECT YOUR LEVEL" subtitle="Pick an edit to watch it full screen, with sound."/>
      <div className="portfolio-toolbar">
        {categories.length > 2 ? <div className="filter-row" role="group" aria-label="Filter videos by category">{categories.map(item => <ArcadeButton key={item} className={`filter-button ${category === item ? "selected" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</ArcadeButton>)}</div> : <span/>}
        <ArcadeButton className="play-all" onClick={() => open(0, { playAll: true })}><ListVideo size={18}/> PLAY ALL ({videos.length})</ArcadeButton>
      </div>
      <div className="video-grid">{filtered.map(video => <VideoCard key={video.id} video={video} index={videos.indexOf(video)}/>)}</div>
      <p className="portfolio-note">MORE LEVELS COMING SOON <span aria-hidden="true">✦</span></p>
    </div>
  </section>;
}
