import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/orders/seller');
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert('Failed to update order status');
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
                <h2 className="text-2xl font-bold">Orders Received 🛍️</h2>
                <p className="text-gray-400">Manage your customer orders</p>
            </div>

            {orders.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-5xl mb-4">📦</div>
                    <p className="text-gray-400">No orders received yet</p>
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
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                    {order.userId && (
                                        <p className="text-sm text-gray-400">Customer: {order.userId.name} ({order.userId.email})</p>
                                    )}
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
                                            <p className="text-sm text-gray-400">Unit Price: ₹{product.price}</p>
                                        </div>
                                        <p className="font-semibold text-primary-400">₹{product.price * product.quantity}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dark-700 pt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-semibold">Total Amount:</span>
                                    <span className="text-xl font-bold text-primary-400">₹{order.totalAmount}</span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => updateOrderStatus(order._id, 'Processing')}
                                        disabled={order.status !== 'Pending'}
                                        className={`btn btn-secondary text-xs ${order.status !== 'Pending' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Mark Processing
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(order._id, 'Shipped')}
                                        disabled={order.status !== 'Processing'}
                                        className={`btn btn-secondary text-xs ${order.status !== 'Processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Mark Shipped
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                        disabled={order.status !== 'Shipped'}
                                        className={`btn btn-success text-xs ${order.status !== 'Shipped' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Mark Delivered
                                    </button>
                                    <button
                                        onClick={() => updateOrderStatus(order._id, 'Cancelled')}
                                        disabled={order.status === 'Delivered' || order.status === 'Cancelled'}
                                        className={`btn btn-danger text-xs ${order.status === 'Delivered' || order.status === 'Cancelled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SellerOrders;
