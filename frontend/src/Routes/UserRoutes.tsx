import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';
import { logoutApi } from '@/Services/user.api';
import { UserNotificationListener } from '@/Features/users/components/UserNotificationListener';

// Lazy load components
const Home = lazy(() => import('../Features/users/home/pages/Home'));
const SuccessPage = lazy(
    () => import('@/Features/users/payment/pages/SuccessPage')
);
const CancelPage = lazy(
    () => import('@/Features/users/payment/pages/CancelPage')
);
const ChatPage = lazy(() => import('@/Features/users/chat/pages/ChatPage'));
const SubscriptionForm = lazy(
    () => import('@/Features/users/payment/pages/CheckoutForm')
);
const UserProfilePage = lazy(
    () => import('@/Features/users/profile/pages/UserProfilePage')
);
const TasksPage = lazy(
    () => import('@/Features/users/KanbanBorad/pages/TasksPage')
);
const MentorListingPage = lazy(
    () => import('@/Features/users/mentors/pages/MentorListingPage')
);
const MentorDetailPage = lazy(
    () => import('@/Features/users/mentors/pages/MentorDetailPage')
);
const PlannerPage = lazy(
    () => import('@/Features/users/planner/pages/PlannerPage')
);
const MentorshipManagementPage = lazy(
    () => import('../Features/users/mentors/pages/MentorshipManagementPage')
);
const MyMentorshipsPage = lazy(
    () => import('@/Features/users/mentors/pages/MyMentorshipsPage')
);
const NotFound = lazy(() => import('@/Features/common/pages/NotFound'));
const PomodoroPage = lazy(
    () => import('@/Features/users/pomodoro/pages/PomodoroPage')
);
const NotesPage = lazy(() => import('@/Features/users/notes/pages/NotesPage'));
const UserWalletPage = lazy(
    () => import('@/Features/users/profile/pages/UserWalletPage')
);
const BookingHistoryPage = lazy(
    () => import('@/Features/users/mentors/pages/BookingHistoryPage')
);

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
            <Suspense
                fallback={
                    <div className="flex h-screen items-center justify-center">
                        Loading...
                    </div>
                }
            >
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
                    <Route path="mentors/:id" element={<MentorDetailPage />} />
                    <Route
                        path="my-mentorships"
                        element={<MyMentorshipsPage />}
                    />
                    <Route
                        path="mentorship/:id"
                        element={<MentorshipManagementPage />}
                    />
                    <Route
                        path="booking-history"
                        element={<BookingHistoryPage />}
                    />
                    <Route path="planner" element={<PlannerPage />} />
                    <Route path="pomodoro" element={<PomodoroPage />} />
                    <Route path="notes" element={<NotesPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </>
    );
};

export default UserRoutes;
