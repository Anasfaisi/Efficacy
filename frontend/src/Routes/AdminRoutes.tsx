



import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/Features/admin/AdminDashboard';
import AdminLogin from '@/Features/admin/AdminLogin';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';


const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(logout({role:"admin"}));
  return <Navigate to="/admin/login" replace />;
};

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="logout" element ={<Logout />} />
    </Routes>
  );
}; 

export default AdminRoutes;