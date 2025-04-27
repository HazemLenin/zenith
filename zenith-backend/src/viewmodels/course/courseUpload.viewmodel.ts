import { courses, courseChapters, videos, articles } from "../../models";

export interface CourseUploadViewModel {
  title: string;
  description: string;
  price: number;
  chapters: {
    title: string;
    order: number;
    videos: {
      title: string;
      url: string;
      order: number;
    }[];
    articles: {
      title: string;
      content: string;
      order: number;
    }[];
  }[];
}
