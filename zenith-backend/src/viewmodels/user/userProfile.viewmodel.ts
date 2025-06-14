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
