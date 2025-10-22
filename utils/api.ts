/**
 * API Client Utility
 * Centralized API communication with error handling, retries, and interceptors
 */

export interface APIError {
  message: string;
  code?: string;
  status?: number;
  details?: unknown;
}

export interface APIResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 30000; // 30 seconds
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Custom error class for API errors
 */
export class APIException extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'APIException';
  }
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if error is retriable
 */
const isRetriableError = (error: APIException): boolean => {
  if (!error.status) return true;
  // Retry on 5xx errors and network errors
  return error.status >= 500 || error.status === 408 || error.status === 429;
};

/**
 * Enhanced fetch with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = API_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

/**
 * Parse error response
 */
const parseError = async (response: Response): Promise<APIException> => {
  let errorData: { message?: string; code?: string; details?: unknown } = {};

  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = { message: await response.text() };
    }
  } catch {
    errorData = { message: 'Failed to parse error response' };
  }

  return new APIException(
    errorData.message || `Request failed with status ${response.status}`,
    errorData.code,
    response.status,
    errorData.details
  );
};

/**
 * Main API request function with retries
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  retries = MAX_RETRIES
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Add default headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let lastError: APIException | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetchWithTimeout(url, {
        ...options,
        headers,
      });

      // Handle non-2xx responses
      if (!response.ok) {
        const error = await parseError(response);

        // Check if we should retry
        if (attempt < retries && isRetriableError(error)) {
          console.warn(
            `API request failed (attempt ${attempt + 1}/${retries + 1}):`,
            error.message
          );
          await sleep(RETRY_DELAY * Math.pow(2, attempt)); // Exponential backoff
          lastError = error;
          continue;
        }

        throw error;
      }

      // Parse successful response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        return data;
      }

      return {} as T;
    } catch (error) {
      if (error instanceof APIException) {
        lastError = error;
        if (attempt < retries && isRetriableError(error)) {
          await sleep(RETRY_DELAY * Math.pow(2, attempt));
          continue;
        }
        throw error;
      }

      // Network or other errors
      if (error instanceof Error) {
        const networkError = new APIException(
          error.name === 'AbortError' ? 'Request timeout' : error.message || 'Network error',
          'NETWORK_ERROR'
        );

        if (attempt < retries) {
          console.warn(`Network error (attempt ${attempt + 1}/${retries + 1}):`, error.message);
          await sleep(RETRY_DELAY * Math.pow(2, attempt));
          lastError = networkError;
          continue;
        }

        throw networkError;
      }

      throw new APIException('Unknown error occurred');
    }
  }

  throw lastError || new APIException('Request failed after all retries');
};

/**
 * Convenience methods for different HTTP methods
 */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string | number>) => {
    const queryString = params
      ? '?' +
        Object.entries(params)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&')
      : '';
    return apiRequest<T>(`${endpoint}${queryString}`, { method: 'GET' });
  },

  post: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    apiRequest<T>(endpoint, {
      method: 'DELETE',
    }),
};

/**
 * API health check
 */
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    await apiRequest('/health', { method: 'GET' }, 0);
    return true;
  } catch {
    return false;
  }
};
