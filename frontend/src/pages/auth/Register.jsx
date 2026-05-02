import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'USER'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const result = await register(
            formData.name,
            formData.email,
            formData.password,
            formData.role
        );

        if (result.success) {
            if (result.user.role === 'SELLER' && !result.user.isApproved) {
                // Seller needs approval
                alert('Registration successful! Your seller account is pending admin approval.');
                navigate('/login');
            } else {
                // Redirect based on role
                if (result.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/user');
                }
            }
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-md relative animate-slide-up">
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🚀</div>
                    <h1 className="text-4xl font-bold mb-2">
                        Join <span className="text-gradient">GymBuddy</span>
                    </h1>
                    <p className="text-gray-400">Start your fitness journey today</p>
                </div>

                <div className="card glass">
                    <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">I want to register as:</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'USER' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'USER'
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-dark-700 hover:border-dark-600'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">👤</div>
                                    <div className="font-semibold">User</div>
                                    <div className="text-xs text-gray-400">Track fitness & shop</div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: 'SELLER' })}
                                    className={`p-4 rounded-lg border-2 transition-all ${formData.role === 'SELLER'
                                            ? 'border-primary-500 bg-primary-500/10'
                                            : 'border-dark-700 hover:border-dark-600'
                                        }`}
                                >
                                    <div className="text-2xl mb-1">🏪</div>
                                    <div className="font-semibold">Seller</div>
                                    <div className="text-xs text-gray-400">Sell supplements</div>
                                </button>
                            </div>
                        </div>

                        {formData.role === 'SELLER' && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-4 py-3 rounded-lg text-sm">
                                ⚠️ Seller accounts require admin approval before access.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">
                            Login here
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
