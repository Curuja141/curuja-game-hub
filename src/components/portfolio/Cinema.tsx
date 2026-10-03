import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { videos, xPostUrl } from "@/data/videos";
import { ArcadeButton } from "./GamePieces";

type Cinema = {
  open: (index: number, options?: { playAll?: boolean }) => void;
  isOpen: boolean;
};

const CinemaContext = createContext<Cinema>({ open: () => undefined, isOpen: false });

// Any part of the page can call useCinema().open(index) to open the big player on that edit.
export const useCinema = () => useContext(CinemaContext);

export function CinemaProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState<number | null>(null);
  const [autoNext, setAutoNext] = useState(false);
  const [ended, setEnded] = useState(false);
  const player = useRef<HTMLVideoElement>(null);

  const open = useCallback((next: number, options?: { playAll?: boolean }) => {
    setIndex(next);
    setAutoNext(Boolean(options?.playAll));
    setEnded(false);
  }, []);
  const go = useCallback((next: number) => {
    setEnded(false);
    setIndex((next + videos.length) % videos.length);
  }, []);
  const api = useMemo(() => ({ open, isOpen: index !== null }), [open, index]);

  const video = index === null ? null : videos[index];
  const current = index ?? 0;
  const isLast = current === videos.length - 1;
  const nextVideo = videos[(current + 1) % videos.length];

  const handleEnded = () => {
    if (autoNext && !isLast) go(current + 1);
    else setEnded(true);
  };
  const replay = () => {
    const element = player.current;
    setEnded(false);
    if (element) {
      element.currentTime = 0;
      void element.play();
    }
  };
  const startProject = () => {
    setIndex(null);
    window.setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 250);
  };

  return <CinemaContext.Provider value={api}>
    {children}
    <Dialog open={index !== null} onOpenChange={(isOpen) => { if (!isOpen) setIndex(null); }}>
      <DialogContent
        className="video-dialog cinema-dialog"
        aria-describedby="cinema-description"
        onOpenAutoFocus={(event) => { event.preventDefault(); (event.currentTarget as HTMLElement | null)?.focus(); }}
        onKeyDown={(event) => {
          if ((event.target as HTMLElement).tagName === "VIDEO") return;
          if (event.key === "ArrowRight") go(current + 1);
          if (event.key === "ArrowLeft") go(current - 1);
        }}
      >
        <div className="cinema-head">
          <span className="video-category">{video?.category}</span>
          <DialogTitle className="cinema-title">{video?.title}</DialogTitle>
          <DialogDescription id="cinema-description" className="cinema-meta">{video?.description ?? video?.category}</DialogDescription>
        </div>
        <div className="cinema-stage">
          {video && <video key={video.id} ref={player} className="cinema-video" src={video.src} poster={video.poster} controls autoPlay playsInline preload="auto" onPlay={() => setEnded(false)} onEnded={handleEnded}/>}
          {ended && video && <div className="cinema-end" role="status">
            <strong>{isLast ? "Want an edit like this?" : `Up next: ${nextVideo?.title ?? ""}`}</strong>
            <div className="cinema-end-actions">
              {isLast
                ? <><ArcadeButton className="play-all" onClick={startProject}>START A PROJECT</ArcadeButton><ArcadeButton className="button-cream" onClick={() => go(0)}>WATCH FROM THE START</ArcadeButton></>
                : <><ArcadeButton className="play-all" onClick={() => go(current + 1)}>PLAY NEXT</ArcadeButton><ArcadeButton className="button-cream" onClick={replay}><RotateCcw size={16}/> REPLAY</ArcadeButton></>}
            </div>
          </div>}
        </div>
        <div className="cinema-bar">
          <label className="cinema-auto"><input type="checkbox" checked={autoNext} onChange={(event) => setAutoNext(event.target.checked)}/> Auto-play next</label>
          {video?.xPostId && <a className="cinema-x" href={xPostUrl(video.xPostId)} target="_blank" rel="noopener noreferrer">Watch on X ↗</a>}
          <div className="cinema-nav">
            <ArcadeButton className="button-cream" aria-label="Previous edit" onClick={() => go(current - 1)}><ChevronLeft size={18}/></ArcadeButton>
            <span className="cinema-count" aria-live="polite">{current + 1} / {videos.length}</span>
            <ArcadeButton className="button-cream" aria-label="Next edit" onClick={() => go(current + 1)}><ChevronRight size={18}/></ArcadeButton>
          </div>
        </div>
        <ul className="cinema-list" aria-label="All edits">
          {videos.map((item, i) => <li key={item.id}><button type="button" className="cinema-item" aria-current={i === current ? "true" : undefined} onClick={() => go(i)}><img src={item.poster} alt="" loading="lazy"/><span>{item.title}</span></button></li>)}
        </ul>
      </DialogContent>
    </Dialog>
  </CinemaContext.Provider>;
}
