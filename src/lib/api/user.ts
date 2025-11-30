import { api } from './client';
import type {
  GetUsersResponse
} from '$lib/types';

export function getUsers(token: string): Promise<GetUsersResponse> {
  return api.get<GetUsersResponse>('/users', {
    Authorization: `Bearer ${token}`
  });
}
