import { courses, courseChapters, videos, articles } from "../models";

export interface CourseUploadViewModel {
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  chapters: {
    title: string;
    order: number;
    videos: {
      title: string;
      url: string;
      duration: number;
      order: number;
    }[];
    articles: {
      title: string;
      content: string;
      order: number;
    }[];
  }[];
}

export interface CourseListViewModel {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  instructorId: number;
  instructorName: string;
  createdAt: Date;
}

export interface CourseDetailsViewModel {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  instructorId: number;
  instructorName: string;
  chaptersCount: number;
  createdAt: Date;
}

export interface CourseEnrollmentViewModel {
  courseId: number;
  studentId: number;
}

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
