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
        <span className="tv-hit-label"><Play size={16} fill="currentColor"/> WATCH FULL EDIT <small>with sound</small></span>
      </button>
    </div>
    <div className="tv-controls">
      <div><span className="tv-light"/><span className="tv-now">NOW PLAYING: {video.title}</span></div>
      <div className="tv-channels" role="group" aria-label="Choose an edit"><span aria-hidden="true">CH</span>{videos.map((item, i) => <button key={item.id} type="button" className="tv-channel" aria-pressed={i === channel} aria-label={`Channel ${i + 1}: ${item.title}`} onClick={() => changeChannel(i)}>{i + 1}</button>)}</div>
    </div>
  </>;
}

export function Hero() {
  return <section id="home" className="hero-section">
    <div className="hero-decor" aria-hidden="true"><span className="cloud cloud-one"/><span className="cloud cloud-two"/><span className="cloud cloud-three"/><span className="sky-star star-one">✦</span><span className="sky-star star-two">✳</span><span className="sky-star star-three">✦</span><span className="floating-coin coin-one">★</span><span className="floating-coin coin-two">★</span><span className="floating-heart">♥</span></div>
    <div className="hero-main page-container">
      <div className="hero-copy"><div className="hero-kicker"><span className="status-dot"/> PLAYER 01 HAS ENTERED THE GAME</div><h1>CURUJA</h1><div className="hero-ribbon">VIDEO EDITOR <span aria-hidden="true">✦</span></div><p>I turn raw footage into punchy, game-ready edits.</p><div className="tool-tags"><span><span aria-hidden="true">✂</span> Premiere Pro</span><span><span aria-hidden="true">✦</span> After Effects</span></div><div className="hero-buttons"><ArcadeButton asChild className="button-coral"><a href="#contact"><Play fill="currentColor" size={19}/> START A PROJECT</a></ArcadeButton><ArcadeButton asChild className="button-cream"><a href="#portfolio">WATCH MY WORK <ArrowRight size={19}/></a></ArcadeButton></div><a className="press-start" href="#portfolio">▼ PRESS START TO EXPLORE ▼</a></div>
      <div className="hero-character"><span className="character-spark spark-a">✦</span><span className="character-spark spark-b">✳</span><OwlMascot className="hero-owl" id="hero-owl"/><div className="character-platform"><div className="platform-top"/><div className="platform-earth"/></div><span className="character-label">READY TO EDIT!</span></div>
    </div>
    <div className="hero-ground" aria-hidden="true"><div className="ground-grass"/><div className="ground-earth"/></div>
    <div className="showreel-wrap page-container"><div className="showreel-meta"><span className="pixel-label">▶ FEATURED SCREEN</span><span className="showreel-live"><span/> SHOWREEL</span></div><div className="retro-tv"><TvPlayer/></div></div>
  </section>;
}
