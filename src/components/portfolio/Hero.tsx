import { ArrowRight, Play, Volume2 } from "lucide-react";
import { SHOWREEL_YOUTUBE_ID } from "@/data/site";
import { ArcadeButton, OwlMascot } from "./GamePieces";

export function Hero() {
  return <section id="home" className="hero-section">
    <div className="hero-decor" aria-hidden="true"><span className="cloud cloud-one"/><span className="cloud cloud-two"/><span className="cloud cloud-three"/><span className="sky-star star-one">✦</span><span className="sky-star star-two">✳</span><span className="sky-star star-three">✦</span><span className="floating-coin coin-one">★</span><span className="floating-coin coin-two">★</span><span className="floating-heart">♥</span></div>
    <div className="hero-main page-container">
      <div className="hero-copy"><div className="hero-kicker"><span className="status-dot"/> PLAYER 01 HAS ENTERED THE GAME</div><h1>CURUJA</h1><div className="hero-ribbon">VIDEO EDITOR <span aria-hidden="true">✦</span></div><p>I turn raw footage into punchy, game-ready edits.</p><div className="tool-tags"><span><span aria-hidden="true">✂</span> Premiere Pro</span><span><span aria-hidden="true">✦</span> After Effects</span></div><div className="hero-buttons"><ArcadeButton asChild className="button-coral"><a href="#contact"><Play fill="currentColor" size={19}/> START A PROJECT</a></ArcadeButton><ArcadeButton asChild className="button-cream"><a href="#portfolio">WATCH MY WORK <ArrowRight size={19}/></a></ArcadeButton></div><a className="press-start" href="#portfolio">▼ PRESS START TO EXPLORE ▼</a></div>
      <div className="hero-character"><span className="character-spark spark-a">✦</span><span className="character-spark spark-b">✳</span><OwlMascot className="hero-owl" id="hero-owl"/><div className="character-platform"><div className="platform-top"/><div className="platform-earth"/></div><span className="character-label">READY TO EDIT!</span></div>
    </div>
    <div className="hero-ground" aria-hidden="true"><div className="ground-grass"/><div className="ground-earth"/></div>
    <div className="showreel-wrap page-container"><div className="showreel-meta"><span className="pixel-label">▶ FEATURED SCREEN</span><span className="showreel-live"><span/> SHOWREEL</span></div><div className="retro-tv"><div className="tv-screen">{SHOWREEL_YOUTUBE_ID ? <iframe src={`https://www.youtube-nocookie.com/embed/${SHOWREEL_YOUTUBE_ID}`} title="Curuja video editing showreel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/> : <div className="static-screen"><div className="static-pattern"/><div className="static-message"><Play size={36} fill="currentColor"/><strong>SHOWREEL LOADING...</strong><span>INSERT YOUR REEL TO PRESS PLAY</span></div></div>}</div><div className="tv-controls"><div><span className="tv-light"/> CURUJA VISION <small>© VIDEO SYSTEM</small></div><div className="tv-buttons"><Volume2 size={20}/><span className="tv-knob"/></div></div></div></div>
  </section>;
}
