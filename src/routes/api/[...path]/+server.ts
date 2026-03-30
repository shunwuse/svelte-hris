import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import { API_CONFIG, HTTP_STATUS } from '$lib/constants';

// Use a safer way to access the environment variable to avoid TypeScript errors
// if the variable is not yet defined in the generated types.
const API_BASE_URL = env.API_BASE_URL || API_CONFIG.DEFAULT_BASE_URL;
const API_PROXY_ERROR_MESSAGE = 'Internal Server Error via Proxy';
const JSON_CONTENT_TYPE = 'application/json';
const HOP_BY_HOP_HEADERS = new Set([
  'host',
  'connection',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailers',
  'transfer-encoding',
  'upgrade'
]);
const SKIP_RESPONSE_HEADERS = new Set(['content-encoding', 'content-length', 'transfer-encoding']);
const METHODS_WITHOUT_BODY = new Set(['GET', 'HEAD']);

const handle: RequestHandler = async ({ request, params, url }) => {
  // Ensure the base URL ends with a slash to avoid path truncation by URL constructor
  const apiBase = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const targetPath = params.path;
  const targetUrl = new URL(targetPath, apiBase);

  // Append query string if any
  targetUrl.search = url.search;

  // Clone headers and remove hop-by-hop headers that shouldn't be forwarded
  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  const config: RequestInit & { duplex?: string } = {
    method: request.method,
    headers,
    duplex: 'half'
  };

  // Only attach body for non-GET/HEAD requests
  // Using request.body (ReadableStream) is more efficient than reading into memory
  if (!METHODS_WITHOUT_BODY.has(request.method)) {
    config.body = request.body;
  }

  try {
    const response = await fetch(targetUrl.toString(), config);

    // Filter response headers
    const responseHeaders = new Headers();
    for (const [key, value] of response.headers.entries()) {
      if (!SKIP_RESPONSE_HEADERS.has(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return new Response(
      JSON.stringify({ error: API_PROXY_ERROR_MESSAGE, details: String(error) }),
      {
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        headers: { 'Content-Type': JSON_CONTENT_TYPE }
      }
    );
  }
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
export const OPTIONS = handle;
