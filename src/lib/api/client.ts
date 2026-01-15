import type { ApiError } from '$lib/types';

// Backend API base URL
const API_BASE_URL = 'http://localhost:8080';

// Options for ApiClient
export interface ApiClientOptions {
  fetch?: typeof fetch;
  token?: string | null;
}

// Main API client class
export class ApiClient {
  private fetchFn: typeof fetch;
  private token: string | null;

  constructor(options: ApiClientOptions = {}) {
    this.fetchFn = options.fetch ?? fetch;
    this.token = options.token ?? null;
  }

  // Generic fetch wrapper with error handling
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    const response = await this.fetchFn(url, config);

    // Handle non-OK responses
    if (!response.ok) {
      try {
        const errorData: ApiError = await response.json();
        throw new ApiClientError(errorData.error);
      } catch (e) {
        if (e instanceof ApiClientError) throw e;
        throw new Error(`API Request failed with status ${response.status}`);
      }
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // HTTP method helpers
  public get<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers
    });
  }

  public post<T>(endpoint: string, body?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers
    });
  }

  public put<T>(endpoint: string, body?: unknown, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers
    });
  }

  public delete<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers
    });
  }
}

// Base class for API services
export abstract class BaseApi {
  constructor(protected client: ApiClient) {}
}

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
