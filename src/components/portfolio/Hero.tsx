import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { videos } from "@/data/videos";
import { ArcadeButton, OwlMascot } from "./GamePieces";
import { useCinema } from "./Cinema";

// The hero TV: plays a silent preview of the selected edit on a loop. The number buttons change the channel,
// and clicking the screen opens the full edit with sound.
function TvPlayer() {
  const { open, isOpen } = useCinema();
  const [channel, setChannel] = useState(0);
  const [flash, setFlash] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const screen = useRef<HTMLVideoElement>(null);
  const video = videos[channel];

  useEffect(() => { setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches); }, []);
  useEffect(() => {
    const element = screen.current;
    if (!element) return;
    if (reduceMotion || isOpen) element.pause();
    else element.play().catch(() => undefined);
  }, [channel, reduceMotion, isOpen]);

  if (!video) return null;

  const changeChannel = (next: number) => {
    if (next === channel) return;
    setChannel(next);
    setFlash(count => count + 1);
  };

  return <>
    <div className="tv-screen">
      <video key={video.id} ref={screen} className="tv-video" src={video.preview} poster={video.poster} autoPlay={!reduceMotion} muted loop playsInline preload="auto" aria-hidden="true" tabIndex={-1}/>
      {flash > 0 && <div key={flash} className="tv-flash" aria-hidden="true"/>}
      <button type="button" className="tv-hit" onClick={() => open(channel)} aria-label={`Watch ${video.title} with sound`}>
        <span className="tv-play" aria-hidden="true"><Play size={26} fill="currentColor"/></span>
      </button>
    </div>
    <div className="tv-controls">
      <button type="button" className="tv-watch" onClick={() => open(channel)}><Play size={15} fill="currentColor"/> WATCH FULL EDIT</button>
      <span className="tv-now"><span className="tv-light"/><span className="tv-title">NOW PLAYING: {video.title}</span></span>
      <div className="tv-channels" role="group" aria-label="Choose an edit"><span aria-hidden="true">CH</span>{videos.map((item, i) => <button key={item.id} type="button" className="tv-channel" aria-pressed={i === channel} aria-label={`Channel ${i + 1}: ${item.title}`} onClick={() => changeChannel(i)}>{i + 1}</button>)}</div>
    </div>
  </>;
}

export function Hero() {
  return <section id="home" className="hero-section">
    <div className="hero-main page-container">
      <div className="hero-copy"><div className="hero-kicker"><span className="status-dot"/> INDEPENDENT VIDEO EDITOR</div><h1>CURUJA</h1><div className="hero-ribbon">VIDEO EDITOR <span aria-hidden="true">✦</span></div><p>I turn raw footage into punchy, game-ready edits.</p><div className="tool-tags"><span><span aria-hidden="true">✂</span> Premiere Pro</span><span><span aria-hidden="true">✦</span> After Effects</span></div><div className="hero-buttons"><ArcadeButton asChild className="button-coral"><a href="#contact"><Play fill="currentColor" size={19}/> START A PROJECT</a></ArcadeButton><ArcadeButton asChild className="button-cream"><a href="#portfolio">WATCH MY WORK <ArrowRight size={19}/></a></ArcadeButton></div><a className="press-start" href="#portfolio">SCROLL TO EXPLORE ↓</a></div>
      <div className="showreel-wrap"><div className="showreel-meta"><span className="pixel-label">FEATURED EDIT</span><span className="showreel-live"><span/> NOW PLAYING</span></div><div className="retro-tv"><TvPlayer/></div></div>
    </div>
    <div className="hero-signature page-container"><OwlMascot className="hero-signature-owl" id="hero-signature-owl"/><span>EDITING WITH CHARACTER</span><span>01 / SELECTED WORK ↓</span></div>
  </section>;
}
