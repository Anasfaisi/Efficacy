// client/src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { Link } from 'react-router-dom';
import type { RootState } from '@/redux/store';

const AdminDashboard: React.FC = () => {
 const { user } = useAppSelector((state: RootState) => state.auth);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-4">
          Welcome, {user?.email || 'Admin'}! This is the admin dashboard.
        </p>
        <Link
          to="/admin/logout"
          className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;