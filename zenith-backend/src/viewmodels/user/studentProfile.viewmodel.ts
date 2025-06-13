import { StudentSkillTypeType } from "../../models/studentSkill.model";
import { BaseProfileResponse } from "./userProfile.viewmodel";

export interface StudentSkill {
  id: number;
  title: string;
  type: StudentSkillTypeType;
  description?: string;
  points?: number;
}

export interface StudentProfileResponse extends BaseProfileResponse {
  profile: {
    id: number;
    points: number;
    skills: StudentSkill[];
  };
}
