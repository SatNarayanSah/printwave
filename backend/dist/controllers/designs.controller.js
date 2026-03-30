import { AppDataSource } from '../config/data-source.js';
import { CustomDesign } from '../entities/CustomDesign.js';
import { uploadFile, deleteFile } from '../services/storage.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
export const uploadDesign = async (req, res, next) => {
    try {
        if (!req.file)
            throw ApiError.badRequest('No file uploaded');
        const fileUrl = await uploadFile(req.file, 'designs');
        const designRepo = AppDataSource.getRepository(CustomDesign);
        const design = designRepo.create({
            userId: req.user.id,
            name: req.body.name || req.file.originalname,
            fileUrl,
            fileType: req.file.mimetype,
            fileSizeKb: Math.round(req.file.size / 1024),
        });
        await designRepo.save(design);
        return res.status(201).json(ApiResponse.created(design, 'Design uploaded successfully'));
    }
    catch (err) {
        next(err);
    }
};
export const getMyDesigns = async (req, res, next) => {
    try {
        const designRepo = AppDataSource.getRepository(CustomDesign);
        const designs = await designRepo.find({
            where: { userId: req.user.id },
            order: { createdAt: 'DESC' },
        });
        return res.json(ApiResponse.ok(designs));
    }
    catch (err) {
        next(err);
    }
};
export const deleteDesign = async (req, res, next) => {
    try {
        const designRepo = AppDataSource.getRepository(CustomDesign);
        const design = await designRepo.findOneBy({ id: req.params.id, userId: req.user.id });
        if (!design)
            throw ApiError.notFound('Design not found');
        await deleteFile(design.fileUrl);
        await designRepo.remove(design);
        return res.json(ApiResponse.ok(null, 'Design deleted'));
    }
    catch (err) {
        next(err);
    }
};
