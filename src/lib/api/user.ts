import { api } from './client';
import type {
  GetUsersResponse,
  CreateUserRequest
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
