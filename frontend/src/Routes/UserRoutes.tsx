// import { Routes, Route, Navigate } from 'react-router-dom';
// import Login from '../pages/users/Login';
// import Register from '../pages/users/Register';
// import { useAppSelector, useAppDispatch } from '../redux/hooks';
// import { logout } from '../redux/slices/authSlice'; // Adjust based on your Redux setup
// import type { JSX } from 'react';
// import Home from '../pages/users/Home';

// const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
//   const { accessToken } = useAppSelector((state) => state.auth);
//   return accessToken ? children : <Navigate to="/login" replace />;
// };

// const Logout: React.FC = () => {
//   const dispatch = useAppDispatch();
//   dispatch(logout()); // Clears token in Redux store
//   return <Navigate to="/login" replace />;
// };

// const UserRoutes: React.FC = () => {
//   return (
//     <Routes>
//       <Route path="login" element={<Login />} />
//       <Route path="register" element={<Register />} />
//       <Route path="logout" element={<Logout />} />
//       <Route
//         path="home"
//         element={
//           <ProtectedRoute>
//             <Home />
//           </ProtectedRoute>
//         }
//       />
//     </Routes>
//   );
// };

// export default UserRoutes;



import { Routes, Route } from 'react-router-dom';
import Login from '../pages/users/Login';
import Register from '../pages/users/Register';
import Home from '../pages/users/Home';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { logout } from '@/redux/slices/authSlice';


const Logout: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(logout({role:"user"}));
  return <Navigate to="/login" replace />;
};

const UserRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="register" element={<Register />} />
      <Route path="home" element={<Home />} />
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
};

export default UserRoutes;