import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import MentorDashboard from '@/Features/mentors/pages/MentorDashboard';
import { logoutApi } from '@/Services/auth.api';
import ApplicationReceived from '@/Features/mentors/pages/ApplicationReceived';

const Logout: React.FC = async () => {
  const dispatch = useAppDispatch();
  const wait = await logoutApi();
  if (wait) {
    dispatch(logout());
  }
  return <Navigate to="/login" replace />;
};

const MentorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<MentorDashboard />} />
      <Route path="application-received" element={<ApplicationReceived />} />
      <Route path="logout" element={<Logout />} />

    </Routes>
  );
};
export default MentorRoutes;
