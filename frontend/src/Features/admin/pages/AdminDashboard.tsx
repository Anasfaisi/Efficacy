// client/src/pages/admin/AdminDashboard.tsx
import React from 'react';
import { useAppSelector } from '@/redux/hooks';
// import { Link } from 'react-router-dom';
import type { RootState } from '@/redux/store';

const AdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state: RootState) => state.auth);
  console.log(user, 'from admin dashboard');
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome, admin@gmail.com! This is the admin dashboard.
      </p>
    </div>
  );
};
export default AdminDashboard;
