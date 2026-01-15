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

  // Build URL with query parameters
  private buildUrl(
    endpoint: string,
    query?: RequestOptions['query']
  ): string {
    let url = endpoint;
    if (query) {
      const searchParams = new URLSearchParams();

      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const queryString = searchParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }

    return url;
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
  public get<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(this.buildUrl(endpoint, options?.query), {
      method: 'GET',
      headers: options?.headers
    });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(this.buildUrl(endpoint, options?.query), {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: options?.headers
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(this.buildUrl(endpoint, options?.query), {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      headers: options?.headers
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(this.buildUrl(endpoint, options?.query), {
      method: 'DELETE',
      headers: options?.headers
    });
  }
}

// Base class for API services
export abstract class BaseApi {
  constructor(protected client: ApiClient) {}
}

// Options for individual requests
export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>;
  headers?: HeadersInit;
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
