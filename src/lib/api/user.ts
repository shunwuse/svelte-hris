import { api } from './client';
import type {
  GetUsersResponse,
  CreateUserRequest,
  UpdateUserRequest
} from '$lib/types';

export function getUsers(
  token: string,
  params?: { page?: number; per_page?: number }
): Promise<GetUsersResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append('page', params.page.toString());
  if (params?.per_page) query.append('per_page', params.per_page.toString());

  const path = query.toString() ? `/users?${query.toString()}` : '/users';

  return api.get<GetUsersResponse>(path, {
    Authorization: `Bearer ${token}`
  });
}

export function createUser(
  data: CreateUserRequest,
  token: string
): Promise<string> {
  return api.post<string>('/users', data, {
    Authorization: `Bearer ${token}`
  });
}

export function updateUser(
  data: UpdateUserRequest,
  token: string
): Promise<string> {
  return api.put<string>('/users', data, {
    Authorization: `Bearer ${token}`
  });
}
