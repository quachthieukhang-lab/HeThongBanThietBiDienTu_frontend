export interface AuthUser {
  _id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user?: AuthUser;
}
