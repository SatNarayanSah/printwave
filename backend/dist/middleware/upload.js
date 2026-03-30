// src/middleware/upload.ts
import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';
const storage = multer.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    }
    else {
        cb(ApiError.badRequest('Only image files are allowed'));
    }
};
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
});
