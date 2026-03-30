import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { AppDataSource } from '../config/data-source.js';
import { User } from '../entities/User.js';
export const authenticate = async (req, _res, next) => {
    try {
        // 1. Try httpOnly cookie first (primary method)
        let token = req.cookies?.pw_token;
        // 2. Fallback to Authorization header (for mobile/API clients)
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader?.startsWith('Bearer ')) {
                token = authHeader.split(' ')[1];
            }
        }
        if (!token) {
            throw ApiError.unauthorized('Authentication required. Please log in.');
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
            where: { id: payload.sub },
            select: ['id', 'role', 'isActive', 'isVerified']
        });
        if (!user || !user.isActive) {
            throw ApiError.unauthorized('User account is disabled or does not exist');
        }
        req.user = { sub: payload.sub, id: user.id, role: user.role };
        next();
    }
    catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            return next(ApiError.unauthorized('Invalid or expired session. Please log in again.'));
        }
        next(err);
    }
};
// Named alias used in auth.routes.ts
export { authenticate as auth };
export const authorize = (...roles) => (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    next();
};
