export const COOKIE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
} as const;

export const COOKIE_CONFIG = {
  PATH_ROOT: '/',
  SAME_SITE_LAX: 'lax',
  SAME_SITE_STRICT: 'strict',
  AUTH_MAX_AGE_SECONDS: 24 * 60 * 60,
} as const;
