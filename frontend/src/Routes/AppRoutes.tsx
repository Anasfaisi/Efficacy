import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
// import { updateToken } from '../redux/slices/authSlice';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import AdminLogin from '../Features/admin/pages/AdminLogin';
import Login from '@/Features/users/pages/Login';
import MentorLogin from '@/Features/mentors/pages/MentorLogin';
import Register from '@/Features/users/pages/Register';
import MentorRoutes from './MentorRoutes';
import MentorRegister from '@/Features/mentors/pages/MentorRegister';
import { OTPPage } from '@/Features/users/pages/OTPPage';
import { ForgotResetPassword }from '@/Features/users/pages/ResetPassword';
import { ToastContainer } from 'react-toastify';

const ProtectedRoute: React.FC<{
  role: 'admin' | 'user' | 'mentor';
  children: React.ReactNode;
}> = ({ role, children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  let redirectTo = '/login';
  if (role === 'admin') redirectTo = '/admin/login';
  if (role === 'mentor') redirectTo = '/mentor/login';
  return user?.role === role ? (
    <>{children}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/mentor/login" element={<MentorLogin />} />
        <Route path="/mentor/register" element={<MentorRegister />} />

        <Route path="/verify-otp" element={<OTPPage />} />

        <Route path="/forgot-password" element={<ForgotResetPassword />} />
        <Route path="/reset-password" element={<ForgotResetPassword />} />

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
        <Route path="*" element={<Navigate to="/users/login" replace />} />
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
