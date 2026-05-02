import { useState } from 'react';
import Navbar from '../../components/Navbar';
import FitnessTracker from './FitnessTracker';
import Shop from './Shop';
import MyOrders from './MyOrders';

const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('fitness');

    const tabs = [
        { id: 'fitness', name: 'Fitness Tracker', icon: '🏋️' },
        { id: 'shop', name: 'Shop Supplements', icon: '🛒' },
        { id: 'orders', name: 'My Orders', icon: '📦' }
    ];

    return (
        <div className="min-h-screen bg-dark-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome to Your <span className="text-gradient">Fitness Hub</span> 🎯
                    </h1>
                    <p className="text-gray-400">Track your workouts, build strength, and fuel your journey</p>
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
                    {activeTab === 'fitness' && <FitnessTracker />}
                    {activeTab === 'shop' && <Shop />}
                    {activeTab === 'orders' && <MyOrders />}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
