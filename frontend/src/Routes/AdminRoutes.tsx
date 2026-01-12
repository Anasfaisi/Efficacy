import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import AdminDashboard from '@/Features/admin/pages/AdminDashboard';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { logoutApi } from '@/Services/user.api';
import AdminLayout from '@/Features/admin/layout/AdminLayout';
import MentorManagement from '@/Features/admin/mentorManagement/pages/MentorManagement';
import MentorReviewPage from '@/Features/admin/pages/MentorApplicationReviewPage';
import MentorApplicationsPage from '@/Features/admin/pages/MentorApplicationsListPage';
import MentorDetailsPage from '@/Features/admin/mentorManagement/pages/MentorDetailsPage';
import UserManagement from '@/Features/admin/userManagement/pages/UserManagement';

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

const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="logout" element={<Logout />} />
                <Route path="mentorManagement" element={<MentorManagement />} />
                <Route
                    path="mentors/applications"
                    element={<MentorApplicationsPage />}
                />
                <Route
                    path="mentors/details/:id"
                    element={<MentorDetailsPage />}
                />
                <Route
                    path="mentors/review/:id"
                    element={<MentorReviewPage />}
                />
                <Route path="userManagement" element={<UserManagement />} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
