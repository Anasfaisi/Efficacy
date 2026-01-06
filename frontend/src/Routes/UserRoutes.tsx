import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '../Features/users/home/pages/Home';
import { Navigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { logoutApi } from '@/Services/user.api';
import SuccessPage from '@/Features/users/payment/pages/SuccessPage';
import CancelPage from '@/Features/users/payment/pages/CancelPage';
import ChatPage from '@/Features/users/chat/pages/ChatPage';
import SubscriptionForm from '@/Features/users/payment/pages/CheckoutForm';
import UserProfilePage from '@/Features/users/profile/pages/UserProfilePage';
import KanbanBoard from '@/Features/users/KanbanBorad/pages/KanbanBoard';
import MentorListingPage from '@/Features/users/mentors/pages/MentorListingPage';

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

const UserRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="home" element={<Home />} />
            <Route path="logout" element={<Logout />} />

            <Route path="success" element={<SuccessPage />} />
            <Route path="failed" element={<CancelPage />} />
            <Route path="subscription" element={<SubscriptionForm />} />

            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<UserProfilePage />} />

            <Route path="kanbanBoard" element={<KanbanBoard />} />
            <Route path="mentors" element={<MentorListingPage />} />
        </Routes>
    );
};

export default UserRoutes;
