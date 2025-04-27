export interface ChapterDetailsViewModel {
  id: number;
  title: string;
  orderIndex: number;
  videos: {
    id: number;
    title: string;
    videoUrl: string;
  }[];
  articles: {
    id: number;
    title: string;
    content: string;
  }[];
}
