import { Routes, Route } from 'react-router-dom';
import Home from '../Features/users/home/pages/Home';
import { Navigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { logoutApi } from '@/Services/auth.api';
import SuccessPage from '@/Features/users/payment/pages/SuccessPage';
import CancelPage from '@/Features/users/payment/pages/CancelPage';
import ChatPage from '@/Features/users/chat/pages/ChatPage';
import SubscriptionForm from '@/Features/users/payment/pages/CheckoutForm';
import ProfileSetupPage from '@/Features/users/profile/pages/ProfileSetupPage';
import KanbanBoard from '@/Features/users/KanbanBorad/pages/KanbanBoard';

const Logout: React.FC = async () => {
  const dispatch = useAppDispatch();
  const wait = await logoutApi();
  console.log(wait, 'wair from the user routes');
  if (wait) {
    dispatch(logout());
  }
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
      <Route path="profile" element={<ProfileSetupPage />} />

      <Route path="kanbanBoard" element={<KanbanBoard />}  />
    </Routes>
  );
};

export default UserRoutes;
