import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken);

/**
 * @route   POST /api/orders
 * @desc    Place a new order
 * @access  Private (USER only)
 */
router.post('/', requireRole('USER'), async (req, res) => {
    try {
        const { products, deliveryAddress } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Cart is empty.'
            });
        }

        // Validate products and calculate total
        let totalAmount = 0;
        const orderProducts = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product ${item.productId} not found.`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}.`
                });
            }

            orderProducts.push({
                productId: product._id,
                sellerId: product.sellerId,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            totalAmount += product.price * item.quantity;

            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = new Order({
            userId: req.user._id,
            products: orderProducts,
            totalAmount,
            deliveryAddress
        });

        await order.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully.',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to place order.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/orders/user
 * @desc    Get all orders for current user
 * @access  Private (USER only)
 */
router.get('/user', requireRole('USER'), async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ orderDate: -1 })
            .populate('products.productId', 'name imageUrl');

        res.json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get orders.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/orders/seller
 * @desc    Get all orders containing seller's products
 * @access  Private (SELLER only)
 */
router.get('/seller', requireRole('SELLER'), async (req, res) => {
    try {
        const orders = await Order.find({
            'products.sellerId': req.user._id
        })
            .sort({ orderDate: -1 })
            .populate('userId', 'name email')
            .populate('products.productId', 'name imageUrl');

        // Filter to show only seller's products in each order
        const filteredOrders = orders.map(order => {
            const sellerProducts = order.products.filter(
                p => p.sellerId.toString() === req.user._id.toString()
            );

            return {
                ...order.toObject(),
                products: sellerProducts,
                totalAmount: sellerProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
            };
        });

        res.json({
            success: true,
            count: filteredOrders.length,
            orders: filteredOrders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get orders.',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private (SELLER only)
 */
router.put('/:id/status', requireRole('SELLER'), async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findOne({
            _id: req.params.id,
            'products.sellerId': req.user._id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully.',
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update order status.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get single order details
 * @access  Private
 */
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('products.productId', 'name imageUrl');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found.'
            });
        }

        // Check authorization
        const isOwner = order.userId._id.toString() === req.user._id.toString();
        const isSeller = order.products.some(
            p => p.sellerId.toString() === req.user._id.toString()
        );
        const isAdmin = req.user.role === 'ADMIN';

        if (!isOwner && !isSeller && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized to view this order.'
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get order.',
            error: error.message
        });
    }
});

export default router;
