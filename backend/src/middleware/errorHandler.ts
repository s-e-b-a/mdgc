import type { Request, Response, NextFunction } from 'express';

/**
 * Custom error class with HTTP status code support.
 */
export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'HttpError';
  }
}

/**
 * Global Express error handler middleware.
 * Catches unhandled errors and returns structured JSON error responses.
 *
 * Returns: { error: string, message: string } with appropriate HTTP status codes:
 * - 400 for bad request errors
 * - 404 for not found errors
 * - 500 for internal server errors (default)
 */
export function errorHandler(
  err: Error | HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled error:', err);

  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const errorType = getErrorType(statusCode);

  res.status(statusCode).json({
    error: errorType,
    message: err.message || 'An unexpected error occurred',
  });
}

/**
 * Maps HTTP status codes to error type strings.
 */
function getErrorType(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return 'Bad Request';
    case 404:
      return 'Not Found';
    case 401:
      return 'Unauthorized';
    case 403:
      return 'Forbidden';
    default:
      return 'Internal Server Error';
  }
}

/**
 * 404 handler middleware - catches unmatched routes.
 */
export function notFoundHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
}
