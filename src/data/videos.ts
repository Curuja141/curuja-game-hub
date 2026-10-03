export type Video = {
  id: string;
  title: string;
  category: string;
  description?: string;
  src: string; // the full edit, with sound (opens in the big player)
  preview: string; // short silent loop that plays on hover and on the hero TV
  poster: string; // still image shown before anything plays
  duration: string; // shown on the card, e.g. "0:21"
  xPostId?: string; // optional: the number at the end of the X post link, adds a "Watch on X" button
};

export const xPostUrl = (postId: string) => `https://x.com/CurujaEdits/status/${postId}`;

// The first video is the featured one: it is the first channel on the hero TV and the first card (right now: the Roblox edit).
// To add an edit, put 3 files in public/videos (the video, a short silent preview and a poster image)
// and copy one block below.
export const videos: Video[] = [
  {
    id: "01",
    title: "I Bought The FASTEST Horse and Made MILLIONS in Roblox",
    category: "Gameplay Edits",
    description: "Bold captions, zooms and quick transitions for a Roblox horse-racing video.",
    src: "/videos/roblox-fastest-horse.mp4",
    preview: "/videos/roblox-fastest-horse-preview.mp4",
    poster: "/videos/roblox-fastest-horse-poster.jpg",
    duration: "0:13",
  },
  {
    id: "02",
    title: "Minecraft But You Enchant Every Second 2",
    category: "Gameplay Edits",
    description: "Before vs. after: raw gameplay next to the finished edit, with captions and timer graphics.",
    src: "/videos/minecraft-enchant-every-second.mp4",
    preview: "/videos/minecraft-enchant-every-second-preview.mp4",
    poster: "/videos/minecraft-enchant-every-second-poster.jpg",
    duration: "0:21",
  },
  {
    id: "03",
    title: "Ben 10 Re-edit 2",
    category: "Re-edits",
    description: "Animated title cards and character name tags in a Ben 10 x Minecraft re-edit.",
    src: "/videos/ben10-reedit.mp4",
    preview: "/videos/ben10-reedit-preview.mp4",
    poster: "/videos/ben10-reedit-poster.jpg",
    duration: "0:22",
  },
];
