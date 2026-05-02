import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const SalesAnalytics = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ordersRes, productsRes] = await Promise.all([
                api.get('/orders/seller'),
                api.get('/products/seller/my-products')
            ]);
            setOrders(ordersRes.data.orders);
            setProducts(productsRes.data.products);
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

    // Calculate analytics
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending' || o.status === 'Processing').length;

    // Order status distribution
    const statusData = [
        { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length },
        { name: 'Processing', value: orders.filter(o => o.status === 'Processing').length },
        { name: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length },
        { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
        { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length },
    ].filter(item => item.value > 0);

    // Product sales analysis
    const productSales = {};
    orders.forEach(order => {
        order.products.forEach(product => {
            if (!productSales[product.name]) {
                productSales[product.name] = { quantity: 0, revenue: 0 };
            }
            productSales[product.name].quantity += product.quantity;
            productSales[product.name].revenue += product.price * product.quantity;
        });
    });

    const productSalesData = Object.entries(productSales).map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue
    })).sort((a, b) => b.revenue - a.revenue);

    const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stat-card">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-2xl font-bold text-white">₹{totalRevenue}</div>
                    <div className="text-sm text-gray-400">Total Revenue</div>
                </div>

                <div className="stat-card">
                    <div className="text-3xl mb-2">📦</div>
                    <div className="text-2xl font-bold text-white">{totalOrders}</div>
                    <div className="text-sm text-gray-400">Total Orders</div>
                </div>

                <div className="stat-card">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="text-2xl font-bold text-white">{deliveredOrders}</div>
                    <div className="text-sm text-gray-400">Delivered Orders</div>
                </div>

                <div className="stat-card">
                    <div className="text-3xl mb-2">⏳</div>
                    <div className="text-2xl font-bold text-white">{pendingOrders}</div>
                    <div className="text-sm text-gray-400">Pending Orders</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Product Sales Chart */}
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Top Products by Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={productSalesData.slice(0, 5)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#f1f5f9' }}
                            />
                            <Bar dataKey="revenue" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Status Distribution */}
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Product Performance Table */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Product Performance</h3>
                {productSalesData.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No sales data available</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Units Sold</th>
                                    <th>Revenue Generated</th>
                                    <th>Avg. Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productSalesData.map((product, index) => (
                                    <tr key={index}>
                                        <td className="font-semibold text-white">{product.name}</td>
                                        <td>{product.quantity}</td>
                                        <td className="text-primary-400 font-semibold">₹{product.revenue}</td>
                                        <td>₹{(product.revenue / product.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Inventory Status */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Inventory Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product._id} className="bg-dark-800 p-4 rounded-lg">
                            <p className="font-semibold text-white mb-1">{product.name}</p>
                            <p className={`text-sm ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                                Stock: {product.stock} units
                            </p>
                            {product.stock < 5 && (
                                <p className="text-xs text-red-400 mt-1">⚠️ Low stock!</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesAnalytics;
