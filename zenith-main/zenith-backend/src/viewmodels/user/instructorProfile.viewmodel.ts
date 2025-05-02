import { BaseProfileResponse } from "./userProfile.viewmodel";

export interface InstructorProfileResponse extends BaseProfileResponse {
  profile: {
    id: number;
    coursesCount: number;
  };
}
