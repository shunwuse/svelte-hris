export const ROLES = {
  ADMINISTRATOR: 'administrator',
  MANAGER: 'manager',
  STAFF: 'staff'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type CreateableRole = Exclude<Role, typeof ROLES.ADMINISTRATOR>;

export const PERMISSIONS = {
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  CREATE_APPROVAL: 'create_approval',
  READ_APPROVAL: 'read_approval',
  ACTION_APPROVAL: 'action_approval'
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
