import { Routes, Route, Navigate } from 'react-router-dom';
import UserRoutes from './UserRoutes';
// import AdminRoutes from './AdminRoutes';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';
// import { checkAdminSession } from '@/redux/slices/adminAuthSlice';

const AppRoutes: React.FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // dispatch(checkAdminSession());
    // dispatch(checkUserSession());
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/*" element={<UserRoutes />} />
      {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
      <Route path="*" element={<Navigate to="/login" />} />
    
    </Routes>
  );
};

export default AppRoutes;