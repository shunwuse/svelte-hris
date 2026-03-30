export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  USERS: '/users',
  USERS_CREATE: '/users/create',
  APPROVALS: '/approvals',
  APPROVALS_CREATE: '/approvals/create'
} as const;

export const ROUTE_BUILDERS = {
  userDetail: (id: number | string) => `${ROUTES.USERS}/${id}`,
  approvalDetail: (id: number | string) => `${ROUTES.APPROVALS}/${id}`
} as const;

export const FORM_ACTIONS = {
  APPROVE: '?/approve',
  REJECT: '?/reject'
} as const;
