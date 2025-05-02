export class SkillViewModel {
  id: number;
  title: string;
  categoryId: number;

  constructor(data: { id: number; title: string; categoryId: number }) {
    this.id = data.id;
    this.title = data.title;
    this.categoryId = data.categoryId;
  }
}
