import { BaseApi } from './client';
import type {
  GetUsersResponse,
  User,
  ListUsersRequest,
  CreateUserRequest,
  UpdateUserRequest
} from '$lib/types';
import { API_ENDPOINTS } from '$lib/constants';

export class UserApi extends BaseApi {
  async list(
    query?: ListUsersRequest
  ): Promise<GetUsersResponse> {
    return this.client.get<GetUsersResponse>(API_ENDPOINTS.USERS, {
      query: query as Record<string, any>
    });
  }

  async get(id: number): Promise<User> {
    return this.client.get<User>(API_ENDPOINTS.userById(id));
  }

  async create(data: CreateUserRequest): Promise<string> {
    return this.client.post<string>(API_ENDPOINTS.USERS, data);
  }

  async update(id: number, data: UpdateUserRequest): Promise<string> {
    return this.client.put<string>(API_ENDPOINTS.userById(id), data);
  }
}
