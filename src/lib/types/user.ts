import type { OffsetPaginationResponse } from './api';

// ==================== User ====================

export interface User {
  id: number;
  username: string;
  name: string;
  created_time: string;
  last_updated_time: string;
}

export type GetUsersResponse = OffsetPaginationResponse<User>;

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  role: 'manager' | 'staff';
}

export interface UpdateUserRequest {
  id: number;
  name?: string;
}
