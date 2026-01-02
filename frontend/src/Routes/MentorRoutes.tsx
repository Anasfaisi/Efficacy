import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import MentorDashboard from '@/Features/mentors/pages/MentorDashboard';
import { logoutApi } from '@/Services/auth.api';
import ApplicationReceived from '@/Features/mentors/pages/ApplicationReceived';
import MentorOnboardingForm from '@/Features/mentors/layout/MentorOnboardingForm';
import MentorGuidelines from '@/Features/mentors/pages/MentorGuidelines';
import MentorApproved from '@/Features/mentors/pages/MentorApproved';
import ApplicationRejected from '@/Features/mentors/pages/ApplicationRejected';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const performLogout = async () => {
    try {
        await logoutApi();
        dispatch(logout());
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };
    performLogout();
  }, [dispatch]);

  return <Navigate to="/login" replace />;
};

const MentorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<MentorDashboard />} />
      <Route path="application-received" element={<ApplicationReceived />} />
      <Route path="application-rejected" element={<ApplicationRejected />} />
      <Route path="onboarding" element={<MentorOnboardingForm />} />
      <Route path="guidelines" element={<MentorGuidelines />} />
      <Route path="approved" element={<MentorApproved />} />
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
};
export default MentorRoutes;
