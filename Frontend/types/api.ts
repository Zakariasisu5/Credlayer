/**
 * CredLayer API Types
 * These types define API responses, errors, and common structures
 */

export enum ApiErrorCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  TIMEOUT = 408,
  CONFLICT = 409,
  RATE_LIMIT = 429,
  SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: any;
  timestamp?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  request_id?: string;
  timestamp: string;
  version?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const API_ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  [ApiErrorCode.UNAUTHORIZED]: 'Please connect your wallet to continue.',
  [ApiErrorCode.FORBIDDEN]: 'You do not have permission to access this resource.',
  [ApiErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ApiErrorCode.TIMEOUT]: 'Request timed out. Please try again.',
  [ApiErrorCode.CONFLICT]: 'A conflict occurred. Please try again.',
  [ApiErrorCode.RATE_LIMIT]: 'Too many requests. Please wait a moment and try again.',
  [ApiErrorCode.SERVER_ERROR]: 'An error occurred on our end. Please try again later.',
  [ApiErrorCode.BAD_GATEWAY]: 'Service temporarily unavailable. Please try again.',
  [ApiErrorCode.SERVICE_UNAVAILABLE]: 'Service is currently unavailable. Please try again later.',
};

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  timestamp: string;
  services?: {
    database: boolean;
    cache: boolean;
    blockchain: boolean;
  };
}
