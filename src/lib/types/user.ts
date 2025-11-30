// ==================== User ====================

export interface User {
  id: number;
  username: string;
  name: string;
  created_time: string;
  last_updated_time: string;
}

export type GetUsersResponse = User[];

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  role: 'manager' | 'staff';
}
