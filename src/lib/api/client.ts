import { browser } from '$app/environment';
import type { ApiError } from '$lib/types';
import { getErrorMessage } from './error-codes';

/**
 * Determine Base URL
 *
 * IMPORTANT: We avoid importing $env/dynamic/private here because this file
 * is included in the client-side bundle. Private environment variables
 * can only be accessed on the server.
 */
const getBaseUrl = () => {
  if (browser) {
    return '/api';
  }
  // On server, we can't easily access private env here without triggering client-side errors during build.
  // We will handle the server-side base URL via the fetch function or a default.
  return '';
};

const API_BASE_URL = getBaseUrl();

// Options for ApiClient
export interface ApiClientOptions {
  fetch?: typeof fetch;
  baseUrl?: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  onTokenUpdate?: (tokens: { access_token: string; refresh_token: string }) => Promise<void> | void;
  onLogout?: () => Promise<void> | void;
}

// Main API client class
export class ApiClient {
  private fetchFn: typeof fetch;
  private baseUrl: string;
  private accessToken: string | null;
  private refreshToken: string | null;
  private onTokenUpdate?: ApiClientOptions['onTokenUpdate'];
  private onLogout?: ApiClientOptions['onLogout'];

  // For handling concurrent refresh calls
  private isRefreshing = false;
  private refreshPromise: Promise<{ access_token: string; refresh_token: string }> | null = null;

  constructor(options: ApiClientOptions = {}) {
    this.fetchFn = options.fetch ?? fetch;
    this.baseUrl = options.baseUrl ?? API_BASE_URL;
    this.accessToken = options.accessToken ?? null;
    this.refreshToken = options.refreshToken ?? null;
    this.onTokenUpdate = options.onTokenUpdate;
    this.onLogout = options.onLogout;
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

  // Generic fetch wrapper with error handling and automatic refresh
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = new Headers(options.headers);
    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    let response = await this.fetchFn(url, config);

    // Detect 401 and TOKEN_EXPIRED error
    if (response.status === 401) {
      const clonedResponse = response.clone();
      try {
        const errorData: ApiError = await clonedResponse.json();

        if (errorData.error.code === 'TOKEN_EXPIRED' && this.refreshToken) {
          // Trigger token refresh
          const newTokens = await this.handleTokenRefresh();

          // Retry the original request with new token
          headers.set('Authorization', `Bearer ${newTokens.access_token}`);
          response = await this.fetchFn(url, { ...config, headers });
        } else {
          // Not an expiry error, or no refresh token available
          throw new ApiClientError(errorData.error);
        }
      } catch (e) {
        // If it's already an ApiClientError, rethrow it
        if (e instanceof ApiClientError) throw e;
        // Otherwise, if JSON parsing fails or other issues, throw generic error
        throw new Error(`API Request failed with status ${response.status}`);
      }
    }

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

  // Handle centralized token refresh with concurrency protection
  private async handleTokenRefresh(): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await this.fetchFn(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: this.refreshToken })
        });

        if (!response.ok) {
          const errorData: ApiError = await response.json();
          // Critical failure: TOKEN_INVALID or TOKEN_EXPIRED on refresh endpoint
          if (
            response.status === 401 ||
            errorData.error.code === 'TOKEN_INVALID' ||
            errorData.error.code === 'TOKEN_EXPIRED'
          ) {
            await this.handleLogout();
          }
          throw new ApiClientError(errorData.error);
        }

        const tokens: {
          access_token: string;
          refresh_token: string;
        } = await response.json();

        // Update local state
        this.accessToken = tokens.access_token;
        this.refreshToken = tokens.refresh_token;

        // Notify external handlers (to update cookies etc.)
        if (this.onTokenUpdate) {
          await this.onTokenUpdate(tokens);
        }

        return tokens;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  private async handleLogout() {
    this.accessToken = null;
    this.refreshToken = null;
    if (this.onLogout) {
      await this.onLogout();
    }
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
    super(getErrorMessage(error.code, error.message));
    this.code = error.code;
    this.details = error.details;
  }
}
