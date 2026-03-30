import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { API_CONFIG, COOKIE_CONFIG, COOKIE_KEYS, HTTP_STATUS, ROUTES } from '$lib/constants';
import { createApi } from '$lib/api';
import { paraglideMiddleware } from '$paraglide/server';
import { env } from '$env/dynamic/private';

const publicRoutes = [ROUTES.LOGIN];

export const handle: Handle = async ({ event, resolve }) => {
  const apiBaseUrl = env.API_BASE_URL || API_CONFIG.DEFAULT_BASE_URL;
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
        event.cookies.set(COOKIE_KEYS.ACCESS_TOKEN, tokens.access_token, {
          path: COOKIE_CONFIG.PATH_ROOT,
          httpOnly: true,
          sameSite: COOKIE_CONFIG.SAME_SITE_LAX,
          secure: !dev
        });
        event.cookies.set(COOKIE_KEYS.REFRESH_TOKEN, tokens.refresh_token, {
          path: COOKIE_CONFIG.PATH_ROOT,
          httpOnly: true,
          sameSite: COOKIE_CONFIG.SAME_SITE_LAX,
          secure: !dev
        });
      },
      onLogout: () => {
        event.cookies.delete(COOKIE_KEYS.ACCESS_TOKEN, { path: COOKIE_CONFIG.PATH_ROOT });
        event.cookies.delete(COOKIE_KEYS.REFRESH_TOKEN, { path: COOKIE_CONFIG.PATH_ROOT });
        redirect(HTTP_STATUS.SEE_OTHER, ROUTES.LOGIN);
      }
    });

    return resolve(event);
  });
};
