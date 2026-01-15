import { BaseApi } from './client';
import type {
  GetUsersResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest
} from '$lib/types';

export class UserApi extends BaseApi {
  async list(
    params?: { page?: number; per_page?: number; }
  ): Promise<GetUsersResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append('page', params.page.toString());
    if (params?.per_page) query.append('per_page', params.per_page.toString());

    const path = query.toString() ? `/users?${query.toString()}` : '/users';

    return this.client.get<GetUsersResponse>(path);
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
