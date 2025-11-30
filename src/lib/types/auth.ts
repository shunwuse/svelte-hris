// ==================== Role ====================

export type Role = 'administrator' | 'manager' | 'staff';

// ==================== Permission ====================

export type Permission =
  | 'create_user'
  | 'read_user'
  | 'update_user'
  | 'create_approval'
  | 'read_approval'
  | 'action_approval';

// ==================== Login ====================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  roles: string[];
  token: string;
}
