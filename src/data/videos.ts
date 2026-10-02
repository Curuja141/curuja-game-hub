export type Video = {
  id: string;
  title: string;
  category: string;
  youtubeId?: string;
  description?: string;
};

// Replace the placeholder titles and add real YouTube IDs to show thumbnails and playable videos.
export const videos: Video[] = [
  { id: "01", title: "Project Title 01", category: "Minecraft Re-edits" },
  { id: "02", title: "Project Title 02", category: "Minecraft Re-edits" },
  { id: "03", title: "Project Title 03", category: "Minecraft Re-edits" },
  { id: "04", title: "Project Title 04", category: "Gameplay Edits" },
  { id: "05", title: "Project Title 05", category: "Gameplay Edits" },
  { id: "06", title: "Project Title 06", category: "Shorts" },
];
