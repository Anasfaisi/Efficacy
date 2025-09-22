import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/Features/admin/pages/AdminDashboard';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { logoutApi } from '@/Services/auth.api';

const Logout: React.FC = async () => {
  const dispatch = useAppDispatch();
  const wait = await logoutApi();
  if (wait) {
    dispatch(logout());
  }
  return <Navigate to="/login" replace />;
};
const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
};

export default AdminRoutes;
