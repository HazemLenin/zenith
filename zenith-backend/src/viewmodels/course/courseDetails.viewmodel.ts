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
