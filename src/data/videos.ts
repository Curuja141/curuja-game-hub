export type Video = {
  id: string;
  title: string;
  category: string;
  youtubeId?: string;
  xPostId?: string; // the number at the end of an X post link: x.com/CurujaEdits/status/<THIS NUMBER>
  description?: string;
};

export const xEmbedUrl = (postId: string) =>
  `https://platform.twitter.com/embed/Tweet.html?id=${postId}&theme=dark&dnt=true&lang=en`;
export const xPostUrl = (postId: string) => `https://x.com/CurujaEdits/status/${postId}`;

// Newest first. To add a video, copy one line, change id/title and paste the X post number (xPostId)
// or a YouTube ID (youtubeId). Titles below are placeholders: rename them to the real names of your edits.
export const videos: Video[] = [
  { id: "01", title: "Featured Edit", category: "Video Edits", xPostId: "2105230179610116570", description: "My latest and featured edit." },
  { id: "02", title: "Edit 02", category: "Video Edits", xPostId: "2101952277032419576" },
  { id: "03", title: "Edit 03", category: "Video Edits", xPostId: "2098521373966487986" },
];
