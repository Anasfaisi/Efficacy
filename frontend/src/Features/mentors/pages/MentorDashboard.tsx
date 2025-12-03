import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Link } from 'react-router-dom';

const MentorDashboard: React.FC = () => {
  const { currentUser } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Home</h2>
        {currentUser ? (
          <>
            <p className="text-lg text-gray-700">
              Welcome, { currentUser.email}!
            </p>
            <Link
              to="/mentor/logout"
              className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </Link>
          </>
        ) : (
          <p className="text-red-500">No authentication data available.</p>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;
