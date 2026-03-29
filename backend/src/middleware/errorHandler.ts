// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  // TypeORM Duplicate Entry Error (Postgres code 23505)
  if (err.code === '23505') {
    return res.status(409).json(ApiResponse.error('A record with this value already exists'));
  }

  logger.error(err.message, { stack: err.stack, url: req.url });
  return res.status(500).json(ApiResponse.error('Something went wrong'));
};
