import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Redirect based on role
            if (result.user.role === 'ADMIN') {
                navigate('/admin');
            } else if (result.user.role === 'SELLER') {
                navigate('/seller');
            } else {
                navigate('/user');
            }
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative animate-slide-up">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">💪</div>
                    <h1 className="text-4xl font-bold mb-2">
                        Welcome to <span className="text-gradient">GymBuddy</span>
                    </h1>
                    <p className="text-gray-400">Track your fitness & shop supplements</p>
                </div>

                <div className="card glass">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
                            Register here
                        </Link>
                    </div>
                </div>

                <div className="mt-6 card glass">
                    <p className="text-xs text-gray-500 text-center mb-2">Demo Credentials:</p>
                    <div className="text-xs text-gray-400 space-y-1">
                        <p>👤 User: user@demo.com / password123</p>
                        <p>🏪 Seller: seller@demo.com / password123</p>
                        <p>👑 Admin: admin@demo.com / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
