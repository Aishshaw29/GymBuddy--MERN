import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Check if seller is approved
    if (user.role === 'SELLER' && !user.isApproved) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="card max-w-md text-center">
                    <div className="text-yellow-400 text-5xl mb-4">⏳</div>
                    <h2 className="text-2xl font-bold mb-2">Approval Pending</h2>
                    <p className="text-gray-400">
                        Your seller account is pending admin approval. You'll receive access once approved.
                    </p>
                </div>
            </div>
        );
    }

    // Check role if specified
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
