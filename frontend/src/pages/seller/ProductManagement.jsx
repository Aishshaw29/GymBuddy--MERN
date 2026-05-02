import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Protein',
        price: '',
        description: '',
        stock: '',
        imageUrl: ''
    });

    const categories = ['Protein', 'Creatine', 'Pre-workout', 'Multivitamins'];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/seller/my-products');
            setProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, formData);
                alert('Product updated successfully!');
            } else {
                await api.post('/products', formData);
                alert('Product added successfully!');
            }
            setShowForm(false);
            setEditingProduct(null);
            setFormData({ name: '', category: 'Protein', price: '', description: '', stock: '', imageUrl: '' });
            fetchProducts();
        } catch (error) {
            alert('Failed to save product: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            category: product.category,
            price: product.price,
            description: product.description,
            stock: product.stock,
            imageUrl: product.imageUrl
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchProducts();
            } catch (error) {
                alert('Failed to delete product');
            }
        }
    };

    const handleToggleActive = async (product) => {
        try {
            await api.put(`/products/${product._id}`, { isActive: !product.isActive });
            fetchProducts();
        } catch (error) {
            alert('Failed to update product status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                onClick={() => {
                    setShowForm(!showForm);
                    setEditingProduct(null);
                    setFormData({ name: '', category: 'Protein', price: '', description: '', stock: '', imageUrl: '' });
                }}
                className="btn btn-primary"
            >
                {showForm ? '❌ Cancel' : '➕ Add New Product'}
            </button>

            {/* Product Form */}
            {showForm && (
                <div className="card animate-slide-up">
                    <h3 className="text-xl font-bold mb-4">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Product Name</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="E.g., Whey Protein Isolate"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Category</label>
                            <select
                                className="input"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="label">Price (₹)</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Stock Quantity</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                min="0"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="label">Description</label>
                            <textarea
                                className="input"
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Product description..."
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="label">Image URL (optional)</label>
                            <input
                                type="url"
                                className="input"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button type="submit" className="btn btn-primary w-full">
                                {editingProduct ? '💾 Update Product' : '➕ Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Products List */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Your Products ({products.length})</h3>
                {products.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No products yet. Add your first product! 🚀</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product._id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                                <div>
                                                    <p className="font-semibold text-white">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.description.slice(0, 50)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-info">{product.category}</span></td>
                                        <td className="font-semibold text-primary-400">₹{product.price}</td>
                                        <td>
                                            <span className={product.stock > 10 ? 'text-green-400' : 'text-yellow-400'}>
                                                {product.stock} units
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleToggleActive(product)}
                                                className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}
                                            >
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </button>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-primary-400 hover:text-primary-300 text-sm"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="text-red-400 hover:text-red-300 text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductManagement;
