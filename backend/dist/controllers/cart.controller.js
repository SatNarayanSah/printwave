import * as cartService from '../services/cart.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const getCart = async (req, res, next) => {
    try {
        const cart = await cartService.getOrCreateCart(req.user.id);
        return res.json(ApiResponse.ok(cart));
    }
    catch (err) {
        next(err);
    }
};
export const addItem = async (req, res, next) => {
    try {
        const item = await cartService.addToCart(req.user.id, req.body);
        return res.status(201).json(ApiResponse.created(item, 'Item added to cart'));
    }
    catch (err) {
        next(err);
    }
};
export const updateItem = async (req, res, next) => {
    try {
        const item = await cartService.updateCartItemQuantity(req.user.id, req.params.id, req.body.quantity);
        return res.json(ApiResponse.ok(item, 'Quantity updated'));
    }
    catch (err) {
        next(err);
    }
};
export const removeItem = async (req, res, next) => {
    try {
        await cartService.removeFromCart(req.user.id, req.params.id);
        return res.json(ApiResponse.ok(null, 'Item removed from cart'));
    }
    catch (err) {
        next(err);
    }
};
export const clearCart = async (req, res, next) => {
    try {
        await cartService.clearCart(req.user.id);
        return res.json(ApiResponse.ok(null, 'Cart cleared'));
    }
    catch (err) {
        next(err);
    }
};
