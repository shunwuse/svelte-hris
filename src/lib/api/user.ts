import { api } from './client';
import type {
  GetUsersResponse,
  CreateUserRequest,
  UpdateUserRequest
} from '$lib/types';

export function getUsers(token: string): Promise<GetUsersResponse> {
  return api.get<GetUsersResponse>('/users', {
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
