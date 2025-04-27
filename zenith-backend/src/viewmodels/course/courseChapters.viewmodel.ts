export interface CourseChaptersViewModel {
  courseId: number;
  chapters: {
    id: number;
    title: string;
    orderIndex: number;
    videosCount: number;
    articlesCount: number;
  }[];
}
