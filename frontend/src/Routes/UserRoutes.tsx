import { Routes, Route } from 'react-router-dom';
import Home from '../Features/users/pages/Home';
import { Navigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { logoutApi } from '@/Services/auth.api';
import SuccessPage from '@/Features/users/payment/SuccessPage';
import CancelPage from '@/Features/users/payment/CancelPage';
import ChatPage from '@/Features/users/chat/ChatPage';

const Logout: React.FC = async () => {
  const dispatch = useAppDispatch();
  const wait = await logoutApi();
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
      <Route path="chat" element={<ChatPage />} />
    </Routes>
  );
};

export default UserRoutes;
