export interface User {
  username: string;
  password: string;
  rol: string;
}

export interface AuthResponse {
  token: string;
}