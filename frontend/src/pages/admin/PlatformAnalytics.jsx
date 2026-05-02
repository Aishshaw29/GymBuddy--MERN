import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PlatformAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/admin/analytics');
            setAnalytics(response.data.analytics);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!analytics) {
        return <div className="text-center text-gray-400">Failed to load analytics</div>;
    }

    // Prepare revenue chart data
    const revenueData = analytics.revenue.byMonth.map(item => ({
        month: `${item._id.month}/${item._id.year}`,
        revenue: item.revenue,
        orders: item.orders
    }));

    // Order status data for pie chart
    const orderStatusData = analytics.orders.byStatus.map(item => ({
        name: item._id,
        value: item.count
    }));

    const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stat-card bg-gradient-to-br from-blue-900 to-blue-800">
                    <div className="text-3xl mb-2">👥</div>
                    <div className="text-2xl font-bold text-white">{analytics.users.total}</div>
                    <div className="text-sm text-blue-200">Total Users</div>
                </div>

                <div className="stat-card bg-gradient-to-br from-green-900 to-green-800">
                    <div className="text-3xl mb-2">🏪</div>
                    <div className="text-2xl font-bold text-white">{analytics.users.sellers}</div>
                    <div className="text-sm text-green-200">Active Sellers</div>
                    {analytics.users.pendingSellers > 0 && (
                        <div className="text-xs text-yellow-300 mt-1">
                            {analytics.users.pendingSellers} pending approval
                        </div>
                    )}
                </div>

                <div className="stat-card bg-gradient-to-br from-purple-900 to-purple-800">
                    <div className="text-3xl mb-2">📦</div>
                    <div className="text-2xl font-bold text-white">{analytics.orders.total}</div>
                    <div className="text-sm text-purple-200">Total Orders</div>
                </div>

                <div className="stat-card bg-gradient-to-br from-yellow-900 to-yellow-800">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-2xl font-bold text-white">₹{analytics.revenue.total}</div>
                    <div className="text-sm text-yellow-200">Total Revenue</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Trend */}
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Revenue Trend (Last 6 Months)</h3>
                    {revenueData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                    labelStyle={{ color: '#f1f5f9' }}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} name="Revenue (₹)" />
                                <Line type="monotone" dataKey="orders" stroke="#0ea5e9" strokeWidth={2} dot={{ fill: '#0ea5e9', r: 4 }} name="Orders" />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No revenue data available</p>
                    )}
                </div>

                {/* Order Status Distribution */}
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Order Status Distribution</h3>
                    {orderStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={orderStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {orderStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-gray-400 text-center py-8">No order data available</p>
                    )}
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
                {analytics.orders.recent.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.orders.recent.map((order) => (
                                    <tr key={order._id}>
                                        <td className="font-mono text-xs">{order._id.slice(-8)}</td>
                                        <td>
                                            <div>
                                                <p className="font-semibold text-white">{order.userId?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{order.userId?.email || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="font-semibold text-primary-400">₹{order.totalAmount}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'Delivered' ? 'badge-success' :
                                                    order.status === 'Cancelled' ? 'badge-danger' :
                                                        'badge-warning'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">No recent orders</p>
                )}
            </div>

            {/* Platform Stats Summary */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Platform Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-dark-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Total Products Listed</p>
                        <p className="text-2xl font-bold text-white">{analytics.products.total}</p>
                    </div>
                    <div className="bg-dark-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Average Order Value</p>
                        <p className="text-2xl font-bold text-white">
                            {analytics.orders.total > 0
                                ? `₹${(analytics.revenue.total / analytics.orders.total).toFixed(2)}`
                                : '₹0'}
                        </p>
                    </div>
                    <div className="bg-dark-800 p-4 rounded-lg">
                        <p className="text-sm text-gray-400">Delivery Success Rate</p>
                        <p className="text-2xl font-bold text-white">
                            {analytics.orders.total > 0
                                ? `${((orderStatusData.find(s => s.name === 'Delivered')?.value || 0) / analytics.orders.total * 100).toFixed(1)}%`
                                : '0%'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformAnalytics;
