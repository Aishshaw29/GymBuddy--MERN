import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserDashboard from './pages/user/UserDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/user/*"
                        element={
                            <ProtectedRoute requiredRole="USER">
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/seller/*"
                        element={
                            <ProtectedRoute requiredRole="SELLER">
                                <SellerDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute requiredRole="ADMIN">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
