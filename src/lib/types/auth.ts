import type { Role } from '$lib/domain';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  roles: Role[];
  access_token: string;
  refresh_token: string;
}
