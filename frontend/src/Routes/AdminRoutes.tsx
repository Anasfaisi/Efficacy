import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/Features/admin/pages/AdminDashboard';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { logoutApi } from '@/Services/auth.api';
import AdminLayout from '@/Features/admin/layout/AdminLayout';
import MentorManagement from '@/Features/admin/pages/MentorManagement/pages/MentorManagement';
import CreateMentorPage from '@/Features/admin/pages/MentorManagement/components/CreateMentorPage';

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
      <Route element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="logout" element={<Logout />} />
        <Route path="mentorManagement" element={<MentorManagement />} />
        <Route path="mentors/create" element={<CreateMentorPage />} />{' '}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
