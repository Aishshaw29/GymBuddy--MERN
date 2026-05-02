import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    category: {
        type: String,
        enum: ['Protein', 'Creatine', 'Pre-workout', 'Multivitamins'],
        required: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x300?text=Product+Image'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for category filtering and seller queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ sellerId: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
