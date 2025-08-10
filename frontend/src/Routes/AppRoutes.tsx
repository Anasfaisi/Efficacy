import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '../redux/store';
import { updateToken } from '../redux/slices/authSlice';
import UserRoutes from './UserRoutes';
import AdminRoutes from './AdminRoutes';
import AdminLogin from '../pages/admin/AdminLogin';
import Login from '@/pages/users/Login';

const ProtectedRoute: React.FC<{ role: 'admin' | 'user' | 'mentor'; children: React.ReactNode }> = ({ role, children }) => {
  const { accessToken, user } = useSelector((state: RootState) => state.auth);
  const redirectTo = role === 'admin' ? '/admin/login' : '/login';
  return accessToken && user?.role === role ? <>{children}</> : <Navigate to={redirectTo} replace />;
};

const AppRoutes: React.FC = () => {
  // const dispatch = useDispatch<AppDispatch>();
//   useEffect(() => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       dispatch(updateToken(token));
//     }
//   }, [dispatch]);

  return (
    <Routes>
      <Route path="/login" element={< Login/>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/*" element={<ProtectedRoute role="user"><UserRoutes /></ProtectedRoute>} />
      <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminRoutes /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/users/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;






























































































