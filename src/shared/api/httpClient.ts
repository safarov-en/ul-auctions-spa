import type { ValidationProblem, ProblemDetail } from './types/openapi';

export class ApiError extends Error {
  public status: number;
  public details: ValidationProblem | ProblemDetail;

  constructor(status: number, details: ValidationProblem | ProblemDetail) {
    super(details.message || 'Ошибка API');
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function fetchApi<T>(url: string, options?: RequestInit, retries = 2): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 404 && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, 150));
        return fetchApi<T>(url, options, retries - 1);
      }

      let errorData: ValidationProblem | ProblemDetail;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          code: 'unknown_error',
          title: 'Ошибка',
          message: 'Произошла непредвиденная ошибка',
        };
      }
      throw new ApiError(response.status, errorData);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (retries > 0 && !(error instanceof ApiError)) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      return fetchApi<T>(url, options, retries - 1);
    }
    throw error;
  }
}