import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const getDashboardRoute = () => {
        if (user?.role === 'ADMIN') return '/admin';
        if (user?.role === 'SELLER') return '/seller';
        return '/user';
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-dark-900 border-b border-dark-800 sticky top-0 z-50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={getDashboardRoute()} className="flex items-center space-x-2 group">
                        <div className="text-3xl">💪</div>
                        <span className="text-2xl font-bold text-gradient group-hover:opacity-80 transition-opacity">
                            GymBuddy
                        </span>
                    </Link>

                    {/* User Info & Actions */}
                    <div className="flex items-center space-x-6">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-gray-400 flex items-center justify-end gap-1">
                                <span className={`w-2 h-2 rounded-full ${user.role === 'ADMIN' ? 'bg-red-500' :
                                        user.role === 'SELLER' ? 'bg-primary-500' :
                                            'bg-green-500'
                                    }`}></span>
                                {user.role}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-dark-800 rounded-lg transition-all duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
