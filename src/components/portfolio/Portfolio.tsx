import { useEffect, useRef, useState } from "react";
import { ListVideo, Play, Volume2 } from "lucide-react";
import { videos, type Video } from "@/data/videos";
import { ArcadeButton, SectionHeading } from "./GamePieces";
import { useCinema } from "./Cinema";

function VideoCard({ video, index, touchPlaying }: { video: Video; index: number; touchPlaying: boolean }) {
  const { open, isOpen } = useCinema();
  const previewRef = useRef<HTMLVideoElement>(null);
  const [pointerOn, setPointerOn] = useState(false); // mouse is over the card, or it has keyboard focus
  const [live, setLive] = useState(false); // true only while the preview is really showing frames
  const previewing = (pointerOn || touchPlaying) && !isOpen;

  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    if (previewing) {
      element.play().catch(() => undefined);
    } else {
      element.pause();
      element.currentTime = 0;
      setLive(false);
    }
  }, [previewing]);

  return <article
    className="video-card reveal sticker"
    data-previewing={previewing ? "true" : undefined}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") setPointerOn(true); }}
    onPointerLeave={(event) => { if (event.pointerType === "mouse") setPointerOn(false); }}
    onFocus={(event) => { if (event.target.matches(":focus-visible")) setPointerOn(true); }}
    onBlur={() => setPointerOn(false)}
    onClick={(event) => { if (!(event.target as HTMLElement).closest("button")) open(index); }}
  >
    <div className="video-thumb">
      {/* The cover image always stays underneath; the preview fades in only once it is really playing. */}
      <img className="video-poster" src={video.poster} alt="" loading="lazy" decoding="async"/>
      <video ref={previewRef} className="preview-video" data-live={live ? "true" : undefined} src={video.preview} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onPlaying={() => setLive(true)}/>
      <button type="button" className="video-open" onClick={() => open(index)} aria-label={`Watch ${video.title} with sound`}/>
      <span className="level-chip">LEVEL {video.id}</span>
      {index === 0 && <span className="video-flag">FEATURED</span>}
      <span className="play-badge" aria-hidden="true"><Play fill="currentColor" size={26}/></span>
    </div>
    <div className="video-details"><div>
      <div className="video-meta"><span className="video-category">{video.category}</span><span className="video-duration">{video.duration}</span></div>
      <h3>{video.title}</h3>
      {video.description && <p className="video-blurb">{video.description}</p>}
      <span className="video-listen" aria-hidden="true"><Volume2 size={14}/> WATCH WITH SOUND</span>
    </div></div>
  </article>;
}

export function Portfolio() {
  const [category, setCategory] = useState("ALL");
  const [touchIndex, setTouchIndex] = useState<number | null>(null);
  const { open } = useCinema();
  const categories = ["ALL", ...new Set(videos.map(video => video.category))];
  const filtered = category === "ALL" ? videos : videos.filter(video => video.category === category);

  // Touch screens have no hover, so the preview plays on the card that is most visible on screen (only one at a time).
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    if (!window.matchMedia("(hover: none)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(document.querySelectorAll<HTMLElement>("#portfolio .video-card"));
    const ratios = new Map<Element, number>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));
      let best: number | null = null;
      let bestRatio = 0.6;
      cards.forEach((card, i) => {
        const ratio = ratios.get(card) ?? 0;
        if (ratio >= bestRatio) { best = i; bestRatio = ratio; }
      });
      setTouchIndex(best);
    }, { threshold: [0, 0.3, 0.6, 0.8, 1] });
    cards.forEach(card => observer.observe(card));
    return () => observer.disconnect();
  }, [category]);

  return <section id="portfolio" className="portfolio-section halftone section-pad">
    <div className="page-container">
      <SectionHeading eyebrow="// LEVEL SELECT" title="SELECT YOUR LEVEL" subtitle="Pick an edit to watch it full screen, with sound."/>
      <div className="portfolio-toolbar">
        {categories.length > 2 ? <div className="filter-row" role="group" aria-label="Filter videos by category">{categories.map(item => <ArcadeButton key={item} className={`filter-button ${category === item ? "selected" : ""}`} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</ArcadeButton>)}</div> : <span/>}
        <ArcadeButton className="play-all" onClick={() => open(0, { playAll: true })}><ListVideo size={18}/> PLAY ALL ({videos.length})</ArcadeButton>
      </div>
      <div className="video-grid">{filtered.map((video, position) => <VideoCard key={video.id} video={video} index={videos.indexOf(video)} touchPlaying={touchIndex === position}/>)}</div>
      <p className="portfolio-note">MORE LEVELS COMING SOON <span aria-hidden="true">✦</span></p>
    </div>
  </section>;
}
