import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/users/Login';
import Register from '../pages/users/Register';
import Dashboard from '../pages/users/Dashboard';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { logout } from '../redux/slices/authSlice'; // Adjust based on your Redux setup
import type { JSX } from 'react';

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { token } = useAppSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(logout()); // Clears token in Redux store
  return <Navigate to="/login" replace />;
};

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="logout" element={<Logout />} />
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