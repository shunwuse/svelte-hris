import { BaseApi } from './client';
import type {
  GetUsersResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest
} from '$lib/types';

export class UserApi extends BaseApi {
  async list(
    query?: { page?: number; per_page?: number; }
  ): Promise<GetUsersResponse> {
    return this.client.get<GetUsersResponse>('/users', { query });
  }

  async get(id: number): Promise<User> {
    return this.client.get<User>(`/users/${id}`);
  }

  async create(data: CreateUserRequest): Promise<string> {
    return this.client.post<string>('/users', data);
  }

  async update(id: number, data: UpdateUserRequest): Promise<string> {
    return this.client.put<string>(`/users/${id}`, data);
  }
}
