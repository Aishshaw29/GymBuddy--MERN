import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            await api.put(`/admin/users/${userId}/activate`, { isActive: !currentStatus });
            fetchUsers();
        } catch (error) {
            alert('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user => {
        if (filter === 'all') return true;
        if (filter === 'active') return user.isActive;
        if (filter === 'inactive') return !user.isActive;
        return user.role === filter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">User Management 👥</h2>
                    <p className="text-gray-400">Manage platform users</p>
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input w-48"
                >
                    <option value="all">All Users</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="USER">Users Only</option>
                    <option value="SELLER">Sellers Only</option>
                    <option value="ADMIN">Admins Only</option>
                </select>
            </div>

            <div className="card">
                {filteredUsers.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No users found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td className="font-semibold text-white">{user.name}</td>
                                        <td className="text-gray-400">{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'ADMIN' ? 'badge-danger' :
                                                    user.role === 'SELLER' ? 'badge-info' :
                                                        'badge-success'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}>
                                                {user.isActive ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            {user.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                    className={`btn text-xs ${user.isActive ? 'btn-danger' : 'btn-success'
                                                        }`}
                                                >
                                                    {user.isActive ? 'Block' : 'Activate'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stat-card">
                    <p className="text-sm text-gray-400 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-white">{users.length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-400 mb-1">Active Users</p>
                    <p className="text-2xl font-bold text-green-400">{users.filter(u => u.isActive && u.role === 'USER').length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-400 mb-1">Active Sellers</p>
                    <p className="text-2xl font-bold text-blue-400">{users.filter(u => u.isActive && u.role === 'SELLER' && u.isApproved).length}</p>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-gray-400 mb-1">Blocked Users</p>
                    <p className="text-2xl font-bold text-red-400">{users.filter(u => !u.isActive).length}</p>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
