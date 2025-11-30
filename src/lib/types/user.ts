// ==================== User ====================

export interface User {
  id: number;
  username: string;
  name: string;
  created_time: string;
  last_updated_time: string;
}

export type GetUsersResponse = User[];
