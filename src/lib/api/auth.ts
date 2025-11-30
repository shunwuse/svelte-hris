import { api } from './client';
import type { LoginRequest, LoginResponse } from '$lib/types';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>('/login', data);
}
