export interface AuthResponse {
  token: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
  };
}
