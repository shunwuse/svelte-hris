import { ROUTES } from './routes';

export const API_CONFIG = {
  DEFAULT_BASE_URL: 'http://localhost:8080',
  PROXY_BASE_PATH: '/api'
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/login',
  USERS: '/users',
  APPROVALS: '/approvals',
  AUTH_REFRESH: '/auth/refresh',
  userById: (id: number | string) => `${ROUTES.USERS}/${id}`,
  approvalById: (id: number | string) => `${ROUTES.APPROVALS}/${id}`,
  approvalAction: (id: number | string) => `${ROUTES.APPROVALS}/${id}/action`
} as const;
