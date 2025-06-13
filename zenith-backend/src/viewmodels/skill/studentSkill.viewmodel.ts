import { StudentSkillTypeType } from "../../models/studentSkill.model";

export class StudentSkillViewModel {
  id: number;
  studentId: number;
  skillId: number;
  type: StudentSkillTypeType;

  constructor(data: {
    id: number;
    studentId: number;
    skillId: number;
    type: StudentSkillTypeType;
  }) {
    this.id = data.id;
    this.studentId = data.studentId;
    this.skillId = data.skillId;
    this.type = data.type;
  }
}
