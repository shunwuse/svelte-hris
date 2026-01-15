import { BaseApi } from './client';
import type { LoginRequest, LoginResponse } from '$lib/types';

export class AuthApi extends BaseApi {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.client.post<LoginResponse>('/login', data);
  }
}
