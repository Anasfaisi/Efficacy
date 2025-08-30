import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { updateToken } from '../redux/slices/authSlice';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import AdminLogin from '../Features/admin/AdminLogin';
import Login from '@/Features/users/Login';
import MentorLogin from '@/Features/mentors/MentorLogin';
import Register from '@/Features/users/Register';
import MentorRoutes from './MentorRoutes';
import MentorRegister from '@/Features/mentors/MentorRegister';
import { OTPPage } from '@/Features/app/OTPPage';
import { ForgotResetPassword } from '@/Features/app/ResetPassword';


const ProtectedRoute: React.FC<{ role: 'admin' | 'user' | 'mentor', children: React.ReactNode }> = ({ role, children }) => {
  const {  user } = useSelector((state: RootState) => state.auth);
  let redirectTo = '/login';
  if (role === 'admin') redirectTo = '/admin/login';
  if (role === 'mentor') redirectTo = '/mentor/login';
  return  user?.role === role ? <>{children}</> : <Navigate to={redirectTo} replace />;
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






























































































