import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

// Use a safer way to access the environment variable to avoid TypeScript errors
// if the variable is not yet defined in the generated types.
const API_BASE_URL = (env as any).API_BASE_URL || 'http://localhost:8080';

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
    const hopByHopHeaders = [
      'host',
      'connection',
      'keep-alive',
      'proxy-authenticate',
      'proxy-authorization',
      'te',
      'trailers',
      'transfer-encoding',
      'upgrade'
    ];
    if (!hopByHopHeaders.includes(key.toLowerCase())) {
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
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    config.body = request.body;
  }

  try {
    const response = await fetch(targetUrl.toString(), config);

    // Filter response headers
    const responseHeaders = new Headers();
    for (const [key, value] of response.headers.entries()) {
      const skipHeaders = ['content-encoding', 'content-length', 'transfer-encoding'];
      if (!skipHeaders.includes(key.toLowerCase())) {
        responseHeaders.set(key, value);
      }
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error via Proxy', details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const HEAD = handle;
export const OPTIONS = handle;
