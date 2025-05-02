import { StudentSkillTypeEnum } from "../../models/studentSkill.model";

export class StudentSkillViewModel {
  id: number;
  studentId: number;
  skillId: number;
  type: StudentSkillTypeEnum;

  constructor(data: {
    id: number;
    studentId: number;
    skillId: number;
    type: StudentSkillTypeEnum;
  }) {
    this.id = data.id;
    this.studentId = data.studentId;
    this.skillId = data.skillId;
    this.type = data.type;
  }
}
