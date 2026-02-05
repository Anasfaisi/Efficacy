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
import TasksPage from '@/Features/users/KanbanBorad/pages/TasksPage';
import MentorListingPage from '@/Features/users/mentors/pages/MentorListingPage';
import PlannerPage from '@/Features/users/planner/pages/PlannerPage';
import MentorshipManagementPage from '../Features/users/mentors/pages/MentorshipManagementPage';
import MyMentorshipsPage from '@/Features/users/mentors/pages/MyMentorshipsPage';
import NotFound from '@/Features/common/pages/NotFound';
import PomodoroPage from '@/Features/users/pomodoro/pages/PomodoroPage';
import NotesPage from '@/Features/users/notes/pages/NotesPage';
import UserWalletPage from '@/Features/users/profile/pages/UserWalletPage';
import { UserNotificationListener } from '@/Features/users/components/UserNotificationListener';


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
        <>
            <UserNotificationListener />
            <Routes>
                <Route path="home" element={<Home />} />
            <Route path="logout" element={<Logout />} />

            <Route path="success" element={<SuccessPage />} />
            <Route path="failed" element={<CancelPage />} />
            <Route path="subscription" element={<SubscriptionForm />} />

            <Route path="chat" element={<ChatPage />} />
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="profile/wallet" element={<UserWalletPage />} />


            <Route path="tasks" element={<TasksPage />} />
            <Route path="mentors" element={<MentorListingPage />} />
            <Route path="my-mentorships" element={<MyMentorshipsPage />} />
            <Route
                path="mentorship/:id"
                element={<MentorshipManagementPage />}
            />
            <Route path="planner" element={<PlannerPage />} />
            <Route path="pomodoro" element={<PomodoroPage />} />
            <Route path="notes" element={<NotesPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
        </>
    );
};

export default UserRoutes;
