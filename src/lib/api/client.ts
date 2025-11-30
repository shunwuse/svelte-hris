import type { ApiError } from '$lib/types';

// Backend API base URL
const API_BASE_URL = 'http://localhost:8080';

// Custom error class for API errors
export class ApiClientError extends Error {
  public code: string;
  public details?: Record<string, string>;

  constructor(error: ApiError['error']) {
    super(error.message);
    this.code = error.code;
    this.details = error.details;
  }
}

// Generic fetch wrapper with error handling
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(url, config);

  // Handle non-OK responses
  if (!response.ok) {
    const errorData: ApiError = await response.json();
    throw new ApiClientError(errorData.error);
  }

  // Handle empty responses (e.g., 204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// HTTP method helpers
export const api = {
  get: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'GET', headers }),

  post: <T>(endpoint: string, body: unknown, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), headers }),

  put: <T>(endpoint: string, body: unknown, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), headers }),

  delete: <T>(endpoint: string, headers?: HeadersInit) =>
    request<T>(endpoint, { method: 'DELETE', headers })
};
