import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const SellerApprovals = () => {
    const [pendingSellers, setPendingSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingSellers();
    }, []);

    const fetchPendingSellers = async () => {
        try {
            const response = await api.get('/admin/sellers/pending');
            setPendingSellers(response.data.sellers);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch pending sellers:', error);
            setLoading(false);
        }
    };

    const handleApproval = async (sellerId, isApproved) => {
        try {
            await api.put(`/admin/sellers/${sellerId}/approve`, { isApproved });
            alert(`Seller ${isApproved ? 'approved' : 'rejected'} successfully!`);
            fetchPendingSellers();
        } catch (error) {
            alert('Failed to update seller status');
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
            <div>
                <h2 className="text-2xl font-bold">Seller Approvals ✅</h2>
                <p className="text-gray-400">Review and approve seller applications</p>
            </div>

            {pendingSellers.length === 0 ? (
                <div className="card text-center py-12">
                    <div className="text-5xl mb-4">✅</div>
                    <p className="text-gray-400">No pending seller approvals</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingSellers.map((seller) => (
                        <div key={seller._id} className="card-hover">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{seller.name}</h3>
                                    <p className="text-sm text-gray-400">{seller.email}</p>
                                </div>
                                <span className="badge badge-warning">Pending</span>
                            </div>

                            <div className="space-y-2 mb-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Role:</span>
                                    <span className="text-white font-semibold">{seller.role}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Registered:</span>
                                    <span className="text-white">
                                        {new Date(seller.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`font-semibold ${seller.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                        {seller.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-dark-700 pt-4">
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleApproval(seller._id, true)}
                                        className="btn btn-success flex-1"
                                    >
                                        ✅ Approve
                                    </button>
                                    <button
                                        onClick={() => handleApproval(seller._id, false)}
                                        className="btn btn-danger flex-1"
                                    >
                                        ❌ Reject
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Info Card */}
            <div className="card bg-gradient-to-r from-primary-900/20 to-primary-800/20 border-primary-700/30">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">ℹ️</div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Seller Approval Guidelines</h3>
                        <ul className="text-sm text-gray-300 space-y-1">
                            <li>• Review seller's registration details carefully</li>
                            <li>• Approved sellers can list and manage products</li>
                            <li>• Rejected sellers will need to re-register</li>
                            <li>• You can deactivate approved sellers anytime from User Management</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerApprovals;
