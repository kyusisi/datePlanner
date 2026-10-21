import type { ApiError } from '@date-planner/shared';

const baseUrl =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly details?: ApiError,
  ) {
    super(
      details
        ? Array.isArray(details.message)
          ? details.message.join(', ')
          : details.message
        : '요청을 처리하지 못했어요.',
    );
  }
}

export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`,
    { ...init, headers: { Accept: 'application/json', ...init?.headers } },
  );
  if (!response.ok) {
    const details = (await response.json().catch(() => undefined)) as
      ApiError | undefined;
    throw new ApiRequestError(response.status, details);
  }
  return response.json() as Promise<T>;
}
