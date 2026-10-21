export const API_PREFIX = 'api/v1';
export const API_SERVICE = 'date-planner-api';
export const DEVELOPMENT_STAGE = 'TASK-01';

/** Future business endpoints may opt into this envelope; health returns plain JSON. */
export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

export interface HealthResponse {
  status: 'ok';
  service: typeof API_SERVICE;
}

export interface DatabaseHealthResponse {
  status: 'ok';
  database: 'connected';
}
