import { StudentSkillTypeEnum } from "../models/studentSkill.model";

export interface BaseProfileResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
  };
}

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

export interface InstructorProfileResponse extends BaseProfileResponse {
  profile: {
    id: number;
    coursesCount: number;
  };
}
