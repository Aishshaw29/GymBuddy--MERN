import express from 'express';
import Product from '../models/Product.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products (public, with filters)
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search } = req.query;

        let query = { isActive: true };

        // Category filter
        if (category) {
            query.category = category;
        }

        // Price range filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Search filter
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query)
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

/**
 * @route   GET /api/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('sellerId', 'name email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.'
            });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get product.',
            error: error.message
        });
    }
});

/**
 * @route   POST /api/products
 * @desc    Add a new product
 * @access  Private (SELLER only)
 */
router.post('/', verifyToken, requireRole('SELLER'), async (req, res) => {
    try {
        const { name, category, price, description, stock, imageUrl } = req.body;

        const product = new Product({
            sellerId: req.user._id,
            name,
            category,
            price,
            description,
            stock,
            imageUrl
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product added successfully.',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add product.',
            error: error.message
        });
    }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (SELLER only - own products)
 */
router.put('/:id', verifyToken, requireRole('SELLER'), async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            sellerId: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or unauthorized.'
            });
        }

        const { name, category, price, description, stock, imageUrl, isActive } = req.body;

        if (name) product.name = name;
        if (category) product.category = category;
        if (price !== undefined) product.price = price;
        if (description) product.description = description;
        if (stock !== undefined) product.stock = stock;
        if (imageUrl) product.imageUrl = imageUrl;
        if (isActive !== undefined) product.isActive = isActive;

        await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully.',
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update product.',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (SELLER only - own products)
 */
router.delete('/:id', verifyToken, requireRole('SELLER'), async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            sellerId: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or unauthorized.'
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
 * @route   GET /api/products/seller/my-products
 * @desc    Get all products for current seller
 * @access  Private (SELLER only)
 */
router.get('/seller/my-products', verifyToken, requireRole('SELLER'), async (req, res) => {
    try {
        const products = await Product.find({ sellerId: req.user._id })
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
