import { BaseApi } from './client';
import type { LoginRequest, LoginResponse } from '$lib/types';
import { API_ENDPOINTS } from '$lib/constants';

export class AuthApi extends BaseApi {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return this.client.post<LoginResponse>(API_ENDPOINTS.LOGIN, data);
  }
}
