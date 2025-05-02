import { StudentSkillTypeEnum } from "../../models/studentSkill.model";
import { BaseProfileResponse } from "./userProfile.viewmodel";

export interface StudentSkill {
  id: number;
  skillId: number;
  type: StudentSkillTypeEnum;
}

export interface StudentProfileResponse extends BaseProfileResponse {
  profile: {
    id: number;
    points: number;
    skills: StudentSkill[];
  };
}
