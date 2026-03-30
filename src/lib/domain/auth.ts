import { PERMISSIONS, ROLES } from '$lib/constants';

export { ROLES, PERMISSIONS };

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type CreateableRole = Exclude<Role, typeof ROLES.ADMINISTRATOR>;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
