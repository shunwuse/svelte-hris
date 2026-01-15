import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { COOKIE_KEYS } from '$lib/constants';
import { createApi } from '$lib/api';

const publicRoutes = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? null;
  const isPublicRoute = publicRoutes.some((route) => event.url.pathname.startsWith(route));

  // Not authenticated then redirect to login
  if (!token && !isPublicRoute) {
    redirect(303, '/login');
  }

  // Authenticated user trying to access login page
  if (token && event.url.pathname === '/login') {
    redirect(303, '/');
  }

  // Store token and API instance in locals for use in server load/actions
  event.locals.token = token;
  event.locals.api = createApi({
    fetch: event.fetch,
    token
  });

  return resolve(event);
};
