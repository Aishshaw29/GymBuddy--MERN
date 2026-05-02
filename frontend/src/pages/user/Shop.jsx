import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const categories = ['Protein', 'Creatine', 'Pre-workout', 'Multivitamins'];

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory]);

    const fetchProducts = async () => {
        try {
            const params = selectedCategory ? `?category=${selectedCategory}` : '';
            const response = await api.get(`/products${params}`);
            setProducts(response.data.products);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        const existing = cart.find(item => item._id === product._id);
        if (existing) {
            setCart(cart.map(item =>
                item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
            ));
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item._id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity === 0) {
            removeFromCart(productId);
        } else {
            setCart(cart.map(item =>
                item._id === productId ? { ...item, quantity } : item
            ));
        }
    };

    const getTotalAmount = () => {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert('Cart is empty');
            return;
        }

        try {
            const orderData = {
                products: cart.map(item => ({
                    productId: item._id,
                    quantity: item.quantity
                })),
                deliveryAddress: checkoutForm
            };

            await api.post('/orders', orderData);
            alert('Order placed successfully! 🎉');
            setCart([]);
            setShowCart(false);
            setCheckoutForm({ street: '', city: '', state: '', zipCode: '', country: '' });
        } catch (error) {
            alert('Failed to place order: ' + (error.response?.data?.message || 'Unknown error'));
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
            {/* Header + Cart Button */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Gym Supplements Store 🏪</h2>
                    <p className="text-gray-400">Fuel your fitness journey</p>
                </div>

                <button
                    onClick={() => setShowCart(!showCart)}
                    className="btn btn-primary relative"
                >
                    🛒 Cart ({cart.length})
                    {cart.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                            {cart.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === ''
                            ? 'bg-primary-600 text-white'
                            : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                        }`}
                >
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedCategory === category
                                ? 'bg-primary-600 text-white'
                                : 'bg-dark-800 text-gray-400 hover:bg-dark-700'
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>

            {/* Cart Sidebar */}
            {showCart && (
                <div className="card animate-slide-up">
                    <h3 className="text-xl font-bold mb-4">Shopping Cart</h3>
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Cart is empty</p>
                    ) : (
                        <>
                            <div className="space-y-3 mb-4">
                                {cart.map((item) => (
                                    <div key={item._id} className="flex justify-between items-center bg-dark-800 p-3 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-white">{item.name}</p>
                                            <p className="text-sm text-gray-400">₹{item.price} each</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                    className="w-8 h-8 bg-dark-700 rounded hover:bg-dark-600"
                                                >
                                                    -
                                                </button>
                                                <span className="font-semibold min-w-[20px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                    className="w-8 h-8 bg-dark-700 rounded hover:bg-dark-600"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item._id)}
                                                className="text-red-400 hover:text-red-300 ml-2"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dark-700 pt-4">
                                <div className="flex justify-between text-lg font-bold mb-4">
                                    <span>Total:</span>
                                    <span className="text-primary-400">₹{getTotalAmount()}</span>
                                </div>

                                <form onSubmit={handleCheckout} className="space-y-3">
                                    <h4 className="font-semibold">Delivery Address</h4>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="Street Address"
                                        value={checkoutForm.street}
                                        onChange={(e) => setCheckoutForm({ ...checkoutForm, street: e.target.value })}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="City"
                                            value={checkoutForm.city}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="State"
                                            value={checkoutForm.state}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, state: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Zip Code"
                                            value={checkoutForm.zipCode}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, zipCode: e.target.value })}
                                            required
                                        />
                                        <input
                                            type="text"
                                            className="input"
                                            placeholder="Country"
                                            value={checkoutForm.country}
                                            onChange={(e) => setCheckoutForm({ ...checkoutForm, country: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success w-full">
                                        🎯 Place Order
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="card text-center py-12">
                    <p className="text-gray-400">No products found in this category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="card-hover">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-lg mb-4"
                            />
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-lg font-bold">{product.name}</h3>
                                <span className="badge badge-info">{product.category}</span>
                            </div>
                            <p className="text-gray-400 text-sm mb-3 line-clamp-2">{product.description}</p>
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-2xl font-bold text-primary-400">₹{product.price}</p>
                                    <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                                </div>
                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock === 0}
                                    className={product.stock > 0 ? "btn btn-primary" : "btn btn-secondary cursor-not-allowed"}
                                >
                                    {product.stock > 0 ? '➕ Add to Cart' : 'Out of Stock'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
