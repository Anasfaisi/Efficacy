// client/src/pages/Home.tsx
import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Home: React.FC = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Home</h2>
        {token && user ? (
          <>
            <p className="text-lg text-gray-700">Welcome, {user.name || user.email}!</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <p className="text-red-500">No authentication data available.</p>
        )}
      </div>
    </div>
  );
};

export default Home;