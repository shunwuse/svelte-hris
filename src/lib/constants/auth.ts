export const ROLES = {
  ADMINISTRATOR: 'administrator',
  MANAGER: 'manager',
  STAFF: 'staff'
} as const;

export const PERMISSIONS = {
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  CREATE_APPROVAL: 'create_approval',
  READ_APPROVAL: 'read_approval',
  ACTION_APPROVAL: 'action_approval'
} as const;
