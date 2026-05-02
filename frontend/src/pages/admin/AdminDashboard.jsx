import { useState } from 'react';
import Navbar from '../../components/Navbar';
import PlatformAnalytics from './PlatformAnalytics';
import UserManagement from './UserManagement';
import SellerApprovals from './SellerApprovals';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');

    const tabs = [
        { id: 'analytics', name: 'Platform Analytics', icon: '📊' },
        { id: 'users', name: 'User Management', icon: '👥' },
        { id: 'sellers', name: 'Seller Approvals', icon: '✅' }
    ];

    return (
        <div className="min-h-screen bg-dark-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        <span className="text-gradient">Admin Dashboard</span> 👑
                    </h1>
                    <p className="text-gray-400">Platform management and oversight</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/50'
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
                    {activeTab === 'analytics' && <PlatformAnalytics />}
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'sellers' && <SellerApprovals />}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
