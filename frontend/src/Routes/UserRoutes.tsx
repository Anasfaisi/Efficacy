import { Routes, Route } from 'react-router-dom';
import Register from '../Features/users/Register';
import Home from '../Features/users/Home';
import { Navigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';
import { useAppDispatch } from '@/redux/hooks';
import { logoutApi } from '@/Services/auth.api';


const Logout: React.FC = async() => {
  const dispatch = useAppDispatch();
  const wait = await logoutApi()
  if(wait){
    dispatch(logout());
  }
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


