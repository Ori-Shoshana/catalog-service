import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../src/errors/httpErrors';

export function errorMiddleware(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error('[Error Handler] Logged Error:', err);

  // Custom errors thrown from services
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      status: 'error',
      message: err.message,
    });
  }

  // Postgres errors (keep mapping)
  const dbError = err as { code?: string; message?: string };

  if (dbError.code === '23502') {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required field in database',
      detail: dbError.message,
    });
  }

  if (dbError.code === '22P02') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid input syntax',
      detail: dbError.message,
    });
  }

  if (dbError.code === 'XX000') {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid Geometry/GeoJSON format',
      detail: dbError.message,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}