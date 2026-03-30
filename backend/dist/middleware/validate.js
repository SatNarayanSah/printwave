import { ApiResponse } from '../utils/ApiResponse.js';
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        return res.status(400).json({
            ...ApiResponse.error('Validation failed'),
            errors,
        });
    }
    req.body = result.data;
    next();
};
