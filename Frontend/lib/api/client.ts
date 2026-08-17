/**
 * CredLayer API Client
 * HTTP client with error handling, retries, and type safety
 */

import { ApiError, ApiErrorCode, API_ERROR_MESSAGES } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_VERSION = 'v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = `${baseUrl}/api/${API_VERSION}`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, timeout = 30000, ...fetchOptions } = options;

    // Build URL with query params
    let url = `${this.baseUrl}${endpoint}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      url += `?${searchParams.toString()}`;
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw this.createError(
          ApiErrorCode.TIMEOUT,
          'Request timeout. Please try again.'
        );
      }

      // Check if error is an ApiError (has code and message properties)
      if (this.isApiError(error)) {
        throw error;
      }

      // Network error
      throw this.createError(
        ApiErrorCode.SERVICE_UNAVAILABLE,
        'Unable to connect to CredLayer services. Please check your connection.'
      );
    }
  }

  private isApiError(error: unknown): error is ApiError {
    return (
      error !== null &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error
    );
  }

  private async handleErrorResponse(response: Response): Promise<ApiError> {
    const code = response.status as ApiErrorCode;
    let message = API_ERROR_MESSAGES[code] || 'An unexpected error occurred.';
    let details = null;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        message = errorData.message;
      }
      if (errorData.details) {
        details = errorData.details;
      }
    } catch {
      // If response is not JSON, use default message
    }

    return this.createError(code, message, details);
  }

  private createError(
    code: ApiErrorCode,
    message: string,
    details?: unknown
  ): ApiError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
    };
  }

  // HTTP Methods
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck() {
    try {
      return await this.get('/health');
    } catch {
      return { status: 'unhealthy' };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
