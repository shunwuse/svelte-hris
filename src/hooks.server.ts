import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { COOKIE_KEYS } from '$lib/constants';
import { createApi } from '$lib/api';
import { paraglideMiddleware } from '$paraglide/server';

const publicRoutes = ['/login'];

export const handle: Handle = async ({ event, resolve }) => {
  // Create a minimal request for the middleware to avoid consuming the original request body.
  // This prevents the "Body has already been read" error in SvelteKit actions.
  const minimalRequest = new Request(event.request.url, {
    method: event.request.method,
    headers: event.request.headers
  });

  return paraglideMiddleware(minimalRequest, async ({ request }) => {
    const accessToken = event.cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? null;
    const refreshToken = event.cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? null;

    // Use the potentially delocalized request's URL
    const url = new URL(request.url);
    const isPublicRoute = publicRoutes.some((route) => url.pathname.startsWith(route));

    // Not authenticated then redirect to login
    if (!accessToken && !isPublicRoute) {
      redirect(303, '/login');
    }

    // Authenticated user trying to access login page
    if (accessToken && url.pathname === '/login') {
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
  });
};
