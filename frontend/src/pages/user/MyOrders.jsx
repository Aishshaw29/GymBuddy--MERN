import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/user');
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Pending': 'badge-warning',
            'Processing': 'badge-info',
            'Shipped': 'badge-info',
            'Delivered': 'badge-success',
            'Cancelled': 'badge-danger'
        };
        return statusMap[status] || 'badge-info';
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
            <div>
                <h2 className="text-2xl font-bold">My Orders 📦</h2>
                <p className="text-gray-400">Track your supplement orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-gray-400">You haven't placed any orders yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order._id} className="card">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-400">Order ID: {order._id.slice(-8)}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <span className={`badge ${getStatusBadge(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.products.map((product, index) => (
                                    <div key={index} className="flex justify-between items-center bg-dark-800 p-3 rounded-lg">
                                        <div>
                                            <p className="font-semibold text-white">{product.name}</p>
                                            <p className="text-sm text-gray-400">Quantity: {product.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-primary-400">₹{product.price * product.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dark-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">Total Amount:</span>
                                    <span className="text-xl font-bold text-primary-400">₹{order.totalAmount}</span>
                                </div>
                                {order.deliveryAddress && (
                                    <div className="mt-3 text-sm text-gray-400">
                                        <p className="font-semibold text-white mb-1">Delivery Address:</p>
                                        <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
                                        <p>{order.deliveryAddress.state} - {order.deliveryAddress.zipCode}, {order.deliveryAddress.country}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
