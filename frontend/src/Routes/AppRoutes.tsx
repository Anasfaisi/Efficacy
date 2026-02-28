import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import AdminLogin from '../Features/admin/pages/AdminLogin';
import Login from '@/Features/users/pages/Login';
import MentorLogin from '@/Features/mentors/pages/MentorLogin';
import Register from '@/Features/users/pages/Register';
import MentorRoutes from './MentorRoutes';
import MentorRegister from '@/Features/mentors/pages/MentorRegister';
import LandingPage from '@/Features/common/pages/LandingPage';
import { OTPPage } from '@/Features/users/pages/OTPPage';
import { ForgotResetPassword } from '@/Features/users/pages/ResetPassword';
import { MentorOtpPage } from '@/Features/mentors/pages/auth/MentorOtpPage';
import { MentorForgotResetPassword } from '@/Features/mentors/pages/auth/MentorForgotResetPassword';
import { ToastContainer } from 'react-toastify';
import NotFound from '@/Features/common/pages/NotFound';
import VideoCallPage from '@/Features/common/pages/VideoCallPage';

const ProtectedRoute: React.FC<{
    role: 'admin' | 'user' | 'mentor' | ('admin' | 'user' | 'mentor')[];
    children: React.ReactNode;
}> = ({ role, children }) => {
    const { currentUser } = useSelector((state: RootState) => state.auth);
    const allowedRoles = Array.isArray(role) ? role : [role];

    let redirectTo = '/login';
    if (allowedRoles.includes('admin') && allowedRoles.length === 1)
        redirectTo = '/admin/login';
    if (allowedRoles.includes('mentor') && allowedRoles.length === 1)
        redirectTo = '/mentor/login';

    return currentUser?.role &&
        allowedRoles.includes(currentUser.role as any) ? (
        <>{children}</>
    ) : (
        <Navigate to={redirectTo} replace />
    );
};

const PublicRoute: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { currentUser } = useSelector((state: RootState) => state.auth);

    if (currentUser?.role) {
        let endPoint = '/home';
        if (currentUser.role === 'admin') endPoint = '/admin/dashboard';
        if (currentUser.role === 'mentor') endPoint = '/mentor/dashboard';
        return <Navigate to={endPoint} replace />;
    }

    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/admin/login"
                    element={
                        <PublicRoute>
                            <AdminLogin />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/mentor/login"
                    element={
                        <PublicRoute>
                            <MentorLogin />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/mentor/register"
                    element={
                        <PublicRoute>
                            <MentorRegister />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/mentor/verify-otp"
                    element={
                        <PublicRoute>
                            <MentorOtpPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/mentor/forgot-password"
                    element={
                        <PublicRoute>
                            <MentorForgotResetPassword />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/mentor/reset-password"
                    element={
                        <PublicRoute>
                            <MentorForgotResetPassword />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/verify-otp"
                    element={
                        <PublicRoute>
                            <OTPPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/forgot-password"
                    element={
                        <PublicRoute>
                            <ForgotResetPassword />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <PublicRoute>
                            <ForgotResetPassword />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/meet/:roomId"
                    element={
                        <ProtectedRoute role={['user', 'mentor']}>
                            <VideoCallPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/*"
                    element={
                        <ProtectedRoute role="user">
                            <UserRoutes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/*"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminRoutes />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mentor/*"
                    element={
                        <ProtectedRoute role="mentor">
                            {' '}
                            <MentorRoutes />{' '}
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default AppRoutes;
