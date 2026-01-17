import type { OffsetPaginationResponse } from './api';
import type { CreateableRole, Role } from '$lib/domain';

// ==================== User ====================

export interface User {
  id: number;
  username: string;
  name: string;
  created_time: string;
  last_updated_time: string;
}

export interface ListUsersRequest {
  page?: number;
  per_page?: number;
  name?: string;
  role?: Role;
}

export type GetUsersResponse = OffsetPaginationResponse<User>;

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  role: CreateableRole;
}

export interface UpdateUserRequest {
  name?: string;
}
