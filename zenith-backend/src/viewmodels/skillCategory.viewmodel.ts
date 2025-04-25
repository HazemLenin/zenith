export class SkillCategoryViewModel {
  id: number;
  title: string;
  minPoints: number;
  maxPoints: number;

  constructor(data: {
    id: number;
    title: string;
    minPoints: number;
    maxPoints: number;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.minPoints = data.minPoints;
    this.maxPoints = data.maxPoints;
  }
}
