// client/src/routes/AdminRoutes.tsx
// import { Navigate, Route, Routes } from 'react-router-dom';
// import AdminLogin from '../pages/admin/AdminLogin';
// import AdminDashboard from '../pages/admin/AdminDashboard';
// import { useAppDispatch, useAppSelector } from '../redux/hooks';
// import { adminLogout } from '../redux/slices/adminAuthSlice';
// import type { JSX } from 'react';

// const ProtectedAdminRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
//   const { accessToken } = useAppSelector((state) => state.adminAuth);
//   console.log('ProtectedAdminRoute - accessToken:', accessToken); // Debug
//   return accessToken ? children : <Navigate to="/admin/login" replace />;
// };

// const AdminLogout: React.FC = () => {
//   const dispatch = useAppDispatch();
//   dispatch(adminLogout());
//   return <Navigate to="/admin/login" replace />;
// };

// const AdminRoutes: React.FC = () => {
  
  // return (
    // <Routes>
      {/* <Route path="login" element={<AdminLogin />} />
      <Route
        path="dashboard"
        element={
          <ProtectedAdminRoute>
            <AdminDashboard />
          </ProtectedAdminRoute>
        }
      />
      <Route path="logout" element={<AdminLogout />} /> */}
    // </Routes>
  // );
// };

// export default AdminRoutes;








import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminLogin from '@/pages/admin/AdminLogin';
import { useAppDispatch } from '@/redux/hooks';
import { logout } from '@/redux/slices/authSlice';


const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  dispatch(logout({role:"admin"}));
  return <Navigate to="/admin/login" replace />;
};

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="login" element={<AdminLogin />} />
      <Route path="logout" element ={<Logout />} />
    </Routes>
  );
}; 

export default AdminRoutes;