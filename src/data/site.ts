// Your real links and contact info live here.
export const SHOWREEL_YOUTUBE_ID = ""; // optional: a YouTube video ID (takes priority over the X post below)
export const SHOWREEL_X_POST_ID = "2105230179610116570"; // featured X post shown on the hero TV (the number at the end of the post link)
export const CONTACT_EMAIL = "iagomendes590@gmail.com";
export const DISCORD_USERNAME = "curuja141"; // Discord usernames are not links, so the site copies it when clicked
export const SOCIAL_LINKS = {
  x: "https://x.com/CurujaEdits",
  discord: "",
  youtube: "",
};

export const navItems = [
  { label: "START", href: "#home" },
  { label: "LEVELS", href: "#portfolio" },
  { label: "SKILLS", href: "#skills" },
  { label: "SERVICES", href: "#services" },
  { label: "PLAYER", href: "#about" },
  { label: "CONTACT", href: "#contact" },
];

export const services = [
  { title: "Gaming Re-edits", description: "Punchy edits of gameplay clips with effects and sound.", icon: "game" },
  { title: "Short-form Content", description: "Vertical edits for Shorts, Reels and TikTok.", icon: "short" },
  { title: "YouTube Videos", description: "Full edits with pacing, captions and polish.", icon: "video" },
  { title: "Motion & Effects", description: "Custom animations and effects made in After Effects.", icon: "motion" },
] as const;

export const processSteps = [
  { title: "Send your footage", description: "Share your clips and tell me what you have in mind." },
  { title: "First cut", description: "I shape the footage into a first playable version." },
  { title: "Feedback round", description: "We fine-tune the edit together." },
  { title: "Final delivery", description: "Your finished video is ready to go live." },
];
