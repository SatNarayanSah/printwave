import { AppDataSource } from '../config/data-source.js';
import { Review } from '../entities/Review.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
export const getProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviewRepo = AppDataSource.getRepository(Review);
        const reviews = await reviewRepo.find({
            where: { productId, isVisible: true },
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
        return res.json(ApiResponse.ok(reviews));
    }
    catch (err) {
        next(err);
    }
};
export const addReview = async (req, res, next) => {
    try {
        const { productId, rating, title, body, imageUrl } = req.body;
        const userId = req.user.id;
        const reviewRepo = AppDataSource.getRepository(Review);
        // Check if user already reviewed this product
        const existing = await reviewRepo.findOneBy({ userId, productId });
        if (existing)
            throw ApiError.conflict('You have already reviewed this product');
        const review = reviewRepo.create({
            userId,
            productId,
            rating,
            title,
            body,
            imageUrl,
        });
        await reviewRepo.save(review);
        return res.status(201).json(ApiResponse.created(review, 'Review added successfully'));
    }
    catch (err) {
        next(err);
    }
};
export const hideReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const reviewRepo = AppDataSource.getRepository(Review);
        const review = await reviewRepo.findOneBy({ id });
        if (!review)
            throw ApiError.notFound('Review not found');
        review.isVisible = false;
        await reviewRepo.save(review);
        return res.json(ApiResponse.ok(null, 'Review hidden by admin'));
    }
    catch (err) {
        next(err);
    }
};
