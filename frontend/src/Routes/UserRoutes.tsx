import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/users/Login';
// import Register from '../pages/users/Register';
import Dashboard from '../pages/users/Dashboard';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice'; // Adjust based on your Redux setup
import type { JSX } from 'react';
import Register from '@/pages/users/Register';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { accessToken } = useAppSelector((state) => state.auth);
  console.log(accessToken,"in the dashboard")
  return accessToken ? children : <Navigate to="/login" replace />;
};

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(logout()); 
  return <Navigate to="/login" replace />;
};

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />
      <Route path="register" element={<Register />}/>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default UserRoutes;

//what kind of route is the protected routes nn chodhiknm
