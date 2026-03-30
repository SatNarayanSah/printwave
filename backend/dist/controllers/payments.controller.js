import * as esewaService from '../services/esewa.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { AppDataSource } from '../config/data-source.js';
import { Order } from '../entities/Order.js';
export const initiateESewa = async (req, res, next) => {
    try {
        const { orderId } = req.body;
        const orderRepo = AppDataSource.getRepository(Order);
        const order = await orderRepo.findOneBy({ id: orderId });
        if (!order)
            throw ApiError.notFound('Order not found');
        const paymentData = await esewaService.initiateESewa(parseFloat(order.total), order.id);
        return res.json(ApiResponse.ok(paymentData, 'eSewa initiated'));
    }
    catch (err) {
        next(err);
    }
};
export const verifyESewa = async (req, res, next) => {
    try {
        const { data } = req.body;
        const result = await esewaService.verifyESewa(data);
        // Process success and update order status to PAID
        return res.json(ApiResponse.ok(result, 'Payment verified'));
    }
    catch (err) {
        next(err);
    }
};
