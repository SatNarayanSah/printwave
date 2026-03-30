import * as orderService from '../services/order.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { OrderStatus } from '../types/enums.js';
export const createOrder = async (req, res, next) => {
    try {
        const { addressId, notes } = req.body;
        const order = await orderService.createOrderFromCart(req.user.id, addressId, notes);
        return res.status(201).json(ApiResponse.created(order, 'Order placed successfully'));
    }
    catch (err) {
        next(err);
    }
};
export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await orderService.findByUser(req.user.id);
        return res.json(ApiResponse.ok(orders));
    }
    catch (err) {
        next(err);
    }
};
export const getOrderDetail = async (req, res, next) => {
    try {
        const order = await orderService.findById(req.params.id, req.user.id);
        return res.json(ApiResponse.ok(order));
    }
    catch (err) {
        next(err);
    }
};
export const cancelOrder = async (req, res, next) => {
    try {
        const order = await orderService.updateOrderStatus(req.params.id, OrderStatus.CANCELLED, 'Cancelled by user', req.user.id);
        return res.json(ApiResponse.ok(order, 'Order cancelled'));
    }
    catch (err) {
        next(err);
    }
};
