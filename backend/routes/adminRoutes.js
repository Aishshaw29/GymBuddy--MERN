import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require ADMIN role
router.use(verifyToken);
router.use(requireRole('ADMIN'));

/**
 * @route   GET /api/admin/users
 * @desc    Get all users
 * @access  Private (ADMIN only)
 */
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get users.',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/admin/users/:id/activate
 * @desc    Activate or deactivate user
 * @access  Private (ADMIN only)
 */
router.put('/users/:id/activate', async (req, res) => {
    try {
        const { isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        user.isActive = isActive;
        await user.save();

        res.json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully.`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update user status.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/admin/sellers/pending
 * @desc    Get all pending seller approvals
 * @access  Private (ADMIN only)
 */
router.get('/sellers/pending', async (req, res) => {
    try {
        const pendingSellers = await User.find({
            role: 'SELLER',
            isApproved: false
        }).select('-password');

        res.json({
            success: true,
            count: pendingSellers.length,
            sellers: pendingSellers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get pending sellers.',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/admin/sellers/:id/approve
 * @desc    Approve or reject seller
 * @access  Private (ADMIN only)
 */
router.put('/sellers/:id/approve', async (req, res) => {
    try {
        const { isApproved } = req.body;

        const seller = await User.findOne({
            _id: req.params.id,
            role: 'SELLER'
        });

        if (!seller) {
            return res.status(404).json({
                success: false,
                message: 'Seller not found.'
            });
        }

        seller.isApproved = isApproved;
        await seller.save();

        res.json({
            success: true,
            message: `Seller ${isApproved ? 'approved' : 'rejected'} successfully.`,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                isApproved: seller.isApproved
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update seller status.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/admin/analytics
 * @desc    Get platform analytics
 * @access  Private (ADMIN only)
 */
router.get('/analytics', async (req, res) => {
    try {
        // Count users by role
        const totalUsers = await User.countDocuments({ role: 'USER' });
        const totalSellers = await User.countDocuments({ role: 'SELLER', isApproved: true });
        const pendingSellers = await User.countDocuments({ role: 'SELLER', isApproved: false });

        // Product statistics
        const totalProducts = await Product.countDocuments({ isActive: true });

        // Order statistics
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$totalAmount' }
                }
            }
        ]);

        // Recent orders
        const recentOrders = await Order.find()
            .sort({ orderDate: -1 })
            .limit(10)
            .populate('userId', 'name email');

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Revenue by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const revenueByMonth = await Order.aggregate([
            {
                $match: {
                    orderDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$orderDate' },
                        month: { $month: '$orderDate' }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        res.json({
            success: true,
            analytics: {
                users: {
                    total: totalUsers,
                    sellers: totalSellers,
                    pendingSellers
                },
                products: {
                    total: totalProducts
                },
                orders: {
                    total: totalOrders,
                    byStatus: ordersByStatus,
                    recent: recentOrders
                },
                revenue: {
                    total: totalRevenue[0]?.total || 0,
                    byMonth: revenueByMonth
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get analytics.',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/admin/products/:id
 * @desc    Delete any product (moderation)
 * @access  Private (ADMIN only)
 */
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        await product.deleteOne();

        res.json({
            success: true,
            message: 'Product deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete product.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/admin/products
 * @desc    Get all products (including inactive)
 * @access  Private (ADMIN only)
 */
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find()
            .populate('sellerId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get products.',
            error: error.message
        });
    }
});

export default router;
