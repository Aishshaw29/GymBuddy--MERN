import { useState } from 'react';
import Navbar from '../../components/Navbar';
import ProductManagement from './ProductManagement';
import SellerOrders from './SellerOrders';
import SalesAnalytics from './SalesAnalytics';

const SellerDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    const tabs = [
        { id: 'products', name: 'My Products', icon: '📦' },
        { id: 'orders', name: 'Orders Received', icon: '🛍️' },
        { id: 'analytics', name: 'Sales Analytics', icon: '📊' }
    ];

    return (
        <div className="min-h-screen bg-dark-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-gradient">Seller Dashboard</span> 🏪
                    </h1>
                    <p className="text-gray-400">Manage your products and orders</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50'
                                    : 'bg-dark-900 text-gray-400 hover:bg-dark-800 border border-dark-800'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="animate-fade-in">
                    {activeTab === 'products' && <ProductManagement />}
                    {activeTab === 'orders' && <SellerOrders />}
                    {activeTab === 'analytics' && <SalesAnalytics />}
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
