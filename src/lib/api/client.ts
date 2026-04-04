import { browser } from '$app/environment';
import { API_CONFIG, API_ENDPOINTS, HTTP_STATUS } from '$lib/constants';
import type { ApiError } from '$lib/types';

import { ERROR_CODES, getErrorMessage } from './error-codes';

/**
 * Determine Base URL
 *
 * IMPORTANT: We avoid importing $env/dynamic/private here because this file
 * is included in the client-side bundle. Private environment variables
 * can only be accessed on the server.
 */
const getBaseUrl = () => {
  if (browser) {
    return API_CONFIG.PROXY_BASE_PATH;
  }
  // On server, we can't easily access private env here without triggering client-side errors during build.
  // We will handle the server-side base URL via the fetch function or a default.
  return '';
};

const API_BASE_URL = getBaseUrl();

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

function isApiErrorPayload(payload: unknown): payload is ApiError {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const error = (payload as { error?: unknown }).error;

  return (
    !!error &&
    typeof error === 'object' &&
    typeof (error as { code?: unknown }).code === 'string' &&
    typeof (error as { message?: unknown }).message === 'string'
  );
}

function isAuthTokens(payload: unknown): payload is AuthTokens {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  return (
    typeof (payload as { access_token?: unknown }).access_token === 'string' &&
    typeof (payload as { refresh_token?: unknown }).refresh_token === 'string'
  );
}

// Options for ApiClient
export interface ApiClientOptions {
  fetch?: typeof fetch;
  baseUrl?: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  onTokenUpdate?: (tokens: AuthTokens) => Promise<void> | void;
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
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor(options: ApiClientOptions = {}) {
    this.fetchFn = options.fetch ?? fetch;
    this.baseUrl = options.baseUrl ?? API_BASE_URL;
    this.accessToken = options.accessToken ?? null;
    this.refreshToken = options.refreshToken ?? null;
    this.onTokenUpdate = options.onTokenUpdate;
    this.onLogout = options.onLogout;
  }

  // Build URL with query parameters
  private buildUrl(endpoint: string, query?: RequestOptions['query']): string {
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

  private buildHeaders(options: RequestInit): Headers {
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    if (this.accessToken) {
      headers.set('Authorization', `Bearer ${this.accessToken}`);
    }

    return headers;
  }

  private async parseApiErrorFromResponse(
    response: Response,
  ): Promise<ApiError['error'] | null> {
    try {
      const payload = await response.clone().json();
      return isApiErrorPayload(payload) ? payload.error : null;
    } catch {
      return null;
    }
  }

  private async throwResponseError(response: Response): Promise<never> {
    const error = await this.parseApiErrorFromResponse(response);

    if (error) {
      throw new ApiClientError(error);
    }

    throw new Error(`API Request failed with status ${response.status}`);
  }

  // Generic fetch wrapper with error handling and automatic refresh
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers = this.buildHeaders(options);

    const config: RequestInit = {
      ...options,
      headers,
    };

    let response = await this.fetchFn(url, config);

    // Detect 401 and TOKEN_EXPIRED error
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      const unauthorizedError = await this.parseApiErrorFromResponse(response);

      if (
        unauthorizedError?.code === ERROR_CODES.TOKEN_EXPIRED &&
        this.refreshToken
      ) {
        const newTokens = await this.handleTokenRefresh();
        headers.set('Authorization', `Bearer ${newTokens.access_token}`);
        response = await this.fetchFn(url, { ...config, headers });
      } else if (unauthorizedError) {
        throw new ApiClientError(unauthorizedError);
      } else {
        throw new Error(`API Request failed with status ${response.status}`);
      }
    }

    // Handle non-OK responses
    if (!response.ok) {
      await this.throwResponseError(response);
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === HTTP_STATUS.NO_CONTENT) {
      return undefined as T;
    }

    return response.json();
  }

  private serializeBody(body: unknown): BodyInit | undefined {
    if (body instanceof FormData || body === undefined) {
      return body;
    }

    return JSON.stringify(body);
  }

  // Handle centralized token refresh with concurrency protection
  private async handleTokenRefresh(): Promise<AuthTokens> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        const response = await this.fetchFn(
          `${this.baseUrl}${API_ENDPOINTS.AUTH_REFRESH}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: this.refreshToken }),
          },
        );

        if (!response.ok) {
          const refreshError = await this.parseApiErrorFromResponse(response);

          // Critical failure: TOKEN_INVALID or TOKEN_EXPIRED on refresh endpoint
          if (
            response.status === HTTP_STATUS.UNAUTHORIZED ||
            refreshError?.code === ERROR_CODES.TOKEN_INVALID ||
            refreshError?.code === ERROR_CODES.TOKEN_EXPIRED
          ) {
            await this.handleLogout();
          }

          if (refreshError) {
            throw new ApiClientError(refreshError);
          }

          throw new Error(
            `Token refresh failed with status ${response.status}`,
          );
        }

        const tokens = await response.json();

        if (!isAuthTokens(tokens)) {
          throw new Error('Token refresh response is invalid');
        }

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
      headers: options?.headers,
    });
  }

  public post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(this.buildUrl(endpoint, options?.query), {
      method: 'POST',
      body: this.serializeBody(body),
      headers: options?.headers,
    });
  }

  public put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return this.request<T>(this.buildUrl(endpoint, options?.query), {
      method: 'PUT',
      body: this.serializeBody(body),
      headers: options?.headers,
    });
  }

  public delete<T>(endpoint: string, options?: RequestOptions) {
    return this.request<T>(this.buildUrl(endpoint, options?.query), {
      method: 'DELETE',
      headers: options?.headers,
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
