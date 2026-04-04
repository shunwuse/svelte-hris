import type { Cookies } from '@sveltejs/kit';

import { dev } from '$app/environment';
import { COOKIE_CONFIG, COOKIE_KEYS } from '$lib/constants';
import type { Role } from '$lib/domain';

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface UserInfoCookie {
  username: string;
  roles: Role[];
}

function createTokenCookieOptions() {
  return {
    path: COOKIE_CONFIG.PATH_ROOT,
    httpOnly: true,
    secure: !dev,
    sameSite: COOKIE_CONFIG.SAME_SITE_STRICT,
    maxAge: COOKIE_CONFIG.AUTH_MAX_AGE_SECONDS,
  } as const;
}

function createUserInfoCookieOptions() {
  return {
    path: COOKIE_CONFIG.PATH_ROOT,
    httpOnly: false,
    secure: !dev,
    sameSite: COOKIE_CONFIG.SAME_SITE_STRICT,
    maxAge: COOKIE_CONFIG.AUTH_MAX_AGE_SECONDS,
  } as const;
}

export function setAuthTokenCookies(
  cookies: Cookies,
  tokens: AuthTokens,
): void {
  const options = createTokenCookieOptions();

  cookies.set(COOKIE_KEYS.ACCESS_TOKEN, tokens.access_token, options);
  cookies.set(COOKIE_KEYS.REFRESH_TOKEN, tokens.refresh_token, options);
}

export function setUserInfoCookie(
  cookies: Cookies,
  userInfo: UserInfoCookie,
): void {
  cookies.set(
    COOKIE_KEYS.USER_INFO,
    JSON.stringify(userInfo),
    createUserInfoCookieOptions(),
  );
}

export function setAuthSessionCookies(
  cookies: Cookies,
  payload: AuthTokens & UserInfoCookie,
): void {
  setAuthTokenCookies(cookies, payload);
  setUserInfoCookie(cookies, payload);
}

export function clearAuthCookies(cookies: Cookies): void {
  cookies.delete(COOKIE_KEYS.ACCESS_TOKEN, { path: COOKIE_CONFIG.PATH_ROOT });
  cookies.delete(COOKIE_KEYS.REFRESH_TOKEN, { path: COOKIE_CONFIG.PATH_ROOT });
  cookies.delete(COOKIE_KEYS.USER_INFO, { path: COOKIE_CONFIG.PATH_ROOT });
}
