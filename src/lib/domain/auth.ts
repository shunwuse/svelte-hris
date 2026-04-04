import { PERMISSIONS, ROLES } from '$lib/constants';

export { PERMISSIONS, ROLES };

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type CreateableRole = Exclude<Role, typeof ROLES.ADMINISTRATOR>;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export function isRole(value: unknown): value is Role {
  return (
    typeof value === 'string' && Object.values(ROLES).includes(value as Role)
  );
}

export function isCreateableRole(value: unknown): value is CreateableRole {
  return value === ROLES.MANAGER || value === ROLES.STAFF;
}
