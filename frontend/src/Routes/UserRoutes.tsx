import { Routes, Route } from 'react-router-dom';
import Register from '../pages/users/Register';
import Home from '../pages/users/Home';
import { Navigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';


const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(logout({role:"user"}));
  return <Navigate to="/login" replace />;
};

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="home" element={<Home />} />
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
};

export default UserRoutes;