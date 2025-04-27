import { StudentSkillViewModel } from "./studentSkill.viewmodel";

export interface UpdateStudentSkillsResponse {
  success: boolean;
  updatedSkills: StudentSkillViewModel[];
  message?: string;
}
