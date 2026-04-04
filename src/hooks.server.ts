import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';
import { createApi } from '$lib/api';
import { API_CONFIG, COOKIE_KEYS, HTTP_STATUS, ROUTES } from '$lib/constants';
import {
  clearAuthCookies,
  setAuthTokenCookies,
} from '$lib/server/auth-cookies';
import { paraglideMiddleware } from '$paraglide/server';

const publicRoutes = [ROUTES.LOGIN];

function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export const handle: Handle = async ({ event, resolve }) => {
  const apiBaseUrl = env.API_BASE_URL || API_CONFIG.DEFAULT_BASE_URL;
  // Create a minimal request for the middleware to avoid consuming the original request body.
  // This prevents the "Body has already been read" error in SvelteKit actions.
  const minimalRequest = new Request(event.request.url, {
    method: event.request.method,
    headers: event.request.headers,
  });

  return paraglideMiddleware(minimalRequest, async ({ request }) => {
    const accessToken = event.cookies.get(COOKIE_KEYS.ACCESS_TOKEN) ?? null;
    const refreshToken = event.cookies.get(COOKIE_KEYS.REFRESH_TOKEN) ?? null;

    // Use the potentially delocalized request's URL
    const url = new URL(request.url);
    const isPublicPath = isPublicRoute(url.pathname);

    // Not authenticated then redirect to login
    if (!accessToken && !isPublicPath) {
      redirect(HTTP_STATUS.SEE_OTHER, ROUTES.LOGIN);
    }

    // Authenticated user trying to access login page
    if (accessToken && url.pathname === ROUTES.LOGIN) {
      redirect(HTTP_STATUS.SEE_OTHER, ROUTES.ROOT);
    }

    // Store token and API instance in locals for use in server load/actions
    event.locals.accessToken = accessToken;
    event.locals.refreshToken = refreshToken;
    event.locals.api = createApi({
      fetch: event.fetch,
      baseUrl: apiBaseUrl,
      accessToken,
      refreshToken,
      onTokenUpdate: (tokens) => {
        setAuthTokenCookies(event.cookies, tokens);
        event.locals.accessToken = tokens.access_token;
        event.locals.refreshToken = tokens.refresh_token;
      },
      onLogout: () => {
        clearAuthCookies(event.cookies);
        event.locals.accessToken = null;
        event.locals.refreshToken = null;
        redirect(HTTP_STATUS.SEE_OTHER, ROUTES.LOGIN);
      },
    });

    return resolve(event);
  });
};
