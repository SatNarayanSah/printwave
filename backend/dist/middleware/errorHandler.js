import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { logger } from '../utils/logger.js';
const isRecord = (value) => typeof value === 'object' && value !== null;
export const errorHandler = (err, req, res, _next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(ApiResponse.error(err.message));
    }
    // TypeORM Duplicate Entry Error (Postgres code 23505)
    const code = isRecord(err) && (typeof err.code === 'string' || typeof err.code === 'number')
        ? String(err.code)
        : undefined;
    if (code === '23505') {
        return res.status(409).json(ApiResponse.error('A record with this value already exists'));
    }
    const type = isRecord(err) && typeof err.type === 'string'
        ? err.type
        : undefined;
    if (type === 'entity.too.large') {
        return res.status(413).json(ApiResponse.error('Request is too large. Upload fewer or smaller images and try again.'));
    }
    const message = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    logger.error(message, { stack, url: req.url });
    return res.status(500).json(ApiResponse.error('Something went wrong'));
};
