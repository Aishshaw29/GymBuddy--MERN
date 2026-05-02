import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const FitnessTracker = () => {
    const [workouts, setWorkouts] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        exerciseName: '',
        workoutType: 'strength',
        sets: 0,
        reps: 0,
        weight: 0,
        duration: 0,
        caloriesBurned: 0,
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchWorkouts();
        fetchAnalytics();
    }, []);

    const fetchWorkouts = async () => {
        try {
            const response = await api.get('/workouts');
            setWorkouts(response.data.workouts);
        } catch (error) {
            console.error('Failed to fetch workouts:', error);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/workouts/analytics?period=week');
            setAnalytics(response.data.analytics);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/workouts', formData);
            setShowForm(false);
            setFormData({
                exerciseName: '',
                workoutType: 'strength',
                sets: 0,
                reps: 0,
                weight: 0,
                duration: 0,
                caloriesBurned: 0,
                date: new Date().toISOString().split('T')[0]
            });
            fetchWorkouts();
            fetchAnalytics();
        } catch (error) {
            alert('Failed to log workout: ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this workout?')) {
            try {
                await api.delete(`/workouts/${id}`);
                fetchWorkouts();
                fetchAnalytics();
            } catch (error) {
                alert('Failed to delete workout');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Prepare chart data
    const workoutFrequencyData = analytics?.workoutsByDate
        ? Object.entries(analytics.workoutsByDate).map(([date, count]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            workouts: count
        }))
        : [];

    const caloriesData = analytics?.caloriesByDate
        ? Object.entries(analytics.caloriesByDate).map(([date, calories]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            calories
        }))
        : [];

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="stat-card">
                    <div className="text-3xl mb-2">🔥</div>
                    <div className="text-2xl font-bold text-white">{analytics?.currentStreak || 0}</div>
                    <div className="text-sm text-gray-400">Day Streak</div>
                </div>

                <div className="stat-card">
                    <div className="text-3xl mb-2">💪</div>
                    <div className="text-2xl font-bold text-white">{analytics?.totalWorkouts || 0}</div>
                    <div className="text-sm text-gray-400">Workouts This Week</div>
                </div>

                <div className="stat-card">
                    <div className="text-3xl mb-2">⚡</div>
                    <div className="text-2xl font-bold text-white">{analytics?.totalCaloriesBurned || 0}</div>
                    <div className="text-sm text-gray-400">Calories Burned</div>
                </div>

                <div className="stat-card">
                    <div className="text-3xl mb-2">🏆</div>
                    <div className="text-2xl font-bold text-white">{analytics?.longestStreak || 0}</div>
                    <div className="text-sm text-gray-400">Longest Streak</div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Workout Frequency (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={workoutFrequencyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#f1f5f9' }}
                            />
                            <Bar dataKey="workouts" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card">
                    <h3 className="text-lg font-bold mb-4">Calories Burned (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={caloriesData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="date" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#f1f5f9' }}
                            />
                            <Line type="monotone" dataKey="calories" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Add Workout Button */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="btn btn-primary"
            >
                {showForm ? '❌ Cancel' : '➕ Log New Workout'}
            </button>

            {/* Workout Form */}
            {showForm && (
                <div className="card animate-slide-up">
                    <h3 className="text-xl font-bold mb-4">Log Workout</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Exercise Name</label>
                            <input
                                type="text"
                                className="input"
                                value={formData.exerciseName}
                                onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                                placeholder="E.g., Bench Press"
                                required
                            />
                        </div>

                        <div>
                            <label className="label">Workout Type</label>
                            <select
                                className="input"
                                value={formData.workoutType}
                                onChange={(e) => setFormData({ ...formData, workoutType: e.target.value })}
                            >
                                <option value="strength">Strength</option>
                                <option value="cardio">Cardio</option>
                            </select>
                        </div>

                        <div>
                            <label className="label">Sets</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.sets}
                                onChange={(e) => setFormData({ ...formData, sets: Number(e.target.value) })}
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="label">Reps</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.reps}
                                onChange={(e) => setFormData({ ...formData, reps: Number(e.target.value) })}
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="label">Weight (kg)</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                                min="0"
                                step="0.5"
                            />
                        </div>

                        <div>
                            <label className="label">Duration (minutes)</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="label">Calories Burned</label>
                            <input
                                type="number"
                                className="input"
                                value={formData.caloriesBurned}
                                onChange={(e) => setFormData({ ...formData, caloriesBurned: Number(e.target.value) })}
                                min="0"
                            />
                        </div>

                        <div>
                            <label className="label">Date</label>
                            <input
                                type="date"
                                className="input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button type="submit" className="btn btn-primary w-full">
                                💾 Save Workout
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Workout History */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Workout History</h3>
                {workouts.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No workouts logged yet. Start your journey! 🚀</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Exercise</th>
                                    <th>Type</th>
                                    <th>Sets × Reps</th>
                                    <th>Weight</th>
                                    <th>Calories</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {workouts.slice(0, 10).map((workout) => (
                                    <tr key={workout._id}>
                                        <td>{new Date(workout.date).toLocaleDateString()}</td>
                                        <td className="font-semibold text-white">{workout.exerciseName}</td>
                                        <td>
                                            <span className={`badge ${workout.workoutType === 'strength' ? 'badge-info' : 'badge-success'}`}>
                                                {workout.workoutType}
                                            </span>
                                        </td>
                                        <td>{workout.sets} × {workout.reps}</td>
                                        <td>{workout.weight}kg</td>
                                        <td>{workout.caloriesBurned} cal</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(workout._id)}
                                                className="text-red-400 hover:text-red-300 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FitnessTracker;
