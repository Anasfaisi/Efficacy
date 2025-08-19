import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { updateToken } from '../redux/slices/authSlice';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import AdminLogin from '../pages/admin/AdminLogin';
import Login from '@/pages/users/Login';
import MentorLogin from '@/pages/mentors/MentorLogin';
import Register from '@/pages/users/Register';
import MentorRoutes from './MentorRoutes';
import MentorRegister from '@/pages/mentors/MentorRegister';
import { OTPPage } from '@/pages/OTPPage';
import { ForgotResetPassword } from '@/components/app/ResetPassword';


const ProtectedRoute: React.FC<{ role: 'admin' | 'user' | 'mentor', children: React.ReactNode }> = ({ role, children }) => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  let redirectTo = '/login';
  if (role === 'admin') redirectTo = '/admin/login';
  if (role === 'mentor') redirectTo = '/mentor/login';
  return accessToken && user?.role === role ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

const AppRoutes: React.FC = () => {

  return (
    <Routes>
      <Route path="/login" element={< Login/>} />
      <Route path="/register" element ={<Register />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path='/mentor/login' element ={<MentorLogin />} />
      <Route path="/mentor/register" element ={<MentorRegister />} />

      <Route path="/verify-otp" element={<OTPPage/>} />

      <Route path="/forgot-password" element={<ForgotResetPassword/>}  />
      <Route path="/reset-password" element={<ForgotResetPassword/>} />

      <Route path="/*" element={<ProtectedRoute role="user"><UserRoutes /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminRoutes /></ProtectedRoute>} />
      <Route path ="/mentor/*" element={<ProtectedRoute role="mentor"> <MentorRoutes/> </ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/users/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;






























































































