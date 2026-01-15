import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { COOKIE_KEYS } from '$lib/constants';
import { createApi } from '$lib/api';

const publicRoutes = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
  const accessToken = event.cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? null;
  const refreshToken = event.cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? null;
  const isPublicRoute = publicRoutes.some((route) => event.url.pathname.startsWith(route));

  // Not authenticated then redirect to login
  if (!accessToken && !isPublicRoute) {
    redirect(303, '/login');
  }

  // Authenticated user trying to access login page
  if (accessToken && event.url.pathname === '/login') {
    redirect(303, '/');
  }

  // Store token and API instance in locals for use in server load/actions
  event.locals.accessToken = accessToken;
  event.locals.refreshToken = refreshToken;
  event.locals.api = createApi({
    fetch: event.fetch,
    accessToken,
    refreshToken,
    onTokenUpdate: (tokens) => {
      event.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, tokens.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev
      });
      event.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, tokens.refresh_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: !dev
      });
    },
    onLogout: () => {
      event.cookies.delete(COOKIE_KEYS.ACCESS_TOKEN, { path: '/' });
      event.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN, { path: '/' });
      redirect(303, '/login');
    }
  });

  return resolve(event);
};
