// // client/src/pages/admin/AdminLogin.tsx
// import React, { useEffect, useState } from 'react';
// import { useAppDispatch, useAppSelector } from '@/redux/hooks';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { cn } from '@/lib/utils';
// import { z } from 'zod';
// import { adminLogin } from '../../redux/slices/adminAuthSlice';
// import { Link } from 'react-router-dom';

// const adminLoginSchema = z.object({
//   email: z
//     .string()
//     .email({ message: 'Invalid email address' })
//     .min(1, { message: 'Email is required' }),
//   password: z
//     .string()
//     .min(6, { message: 'Password must be at least 6 characters' })
//     .min(1, { message: 'Password is required' }),
// });
// type AdminLoginForm = z.infer<typeof adminLoginSchema>;

// const AdminLogin: React.FC = () => {
//   const dispatch = useAppDispatch();
//   const { isLoading, error, accessToken, user } = useAppSelector((state) => state.adminAuth);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [validationErrors, setValidationErrors] = useState<{
//     [key: string]: string;
//   }>({});

//   // Navigate to dashboard if authenticated
//   useEffect(() => {
//     if (location.pathname === '/admin/dashboard' || isLoading) return;
//     if (accessToken && user?.role === 'admin') {
//       console.log('AdminLogin - Admin token detected, navigating to /admin/dashboard');
//       navigate('/admin/dashboard', { replace: true });
//     }
//   }, [accessToken, user, isLoading, navigate, location.pathname]);

//   const validateForm = (): boolean => {
//     const result = adminLoginSchema.safeParse({ email, password });
//     if (!result.success) {
//       const errors: { [key: string]: string } = {};
//       result.error.issues.forEach((issue) => {
//         if (issue.path.length > 0) {
//           errors[String(issue.path[0])] = issue.message;
//         }
//       });
//       setValidationErrors(errors);
//       return false;
//     }
//     setValidationErrors({});
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) return;
//     console.log('Dispatching adminLogin with:', { email, password });
//     dispatch(adminLogin({ email, password }));
//   };

//   console.log('AdminLogin - Rendering, state:', { isLoading, error, accessToken, user });

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-800">
//       <div className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}>
//         <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
//           Admin Login
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Enter admin email"
//               className={cn(
//                 'w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
//                 { 'border-red-500': validationErrors.email }
//               )}
//               required
//             />
//             {validationErrors.email && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors.email}
//               </p>
//             )}
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Enter admin password"
//               className={cn(
//                 'w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
//                 { 'border-red-500': validationErrors.password }
//               )}
//               required
//             />
//             {validationErrors.password && (
//               <p className="text-red-500 text-sm mt-1">
//                 {validationErrors.password}
//               </p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className={cn(
//               'w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500',
//               { 'opacity-50 cursor-not-allowed': isLoading }
//             )}
//             disabled={isLoading}
//           >
//             {isLoading ? 'Logging in...' : 'Admin Log In'}
//           </button>
//           {error && (
//             <p className="text-red-500 text-sm text-center">{error}</p>
//           )}
//           <p className="text-sm text-gray-500 text-center">
//             Back to user login?{' '}
//             <Link to="/login" className="hover:text-gray-700 hover:underline">
//               User Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AdminLogin;




import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '@/redux/slices/authSlice';
import type { RootState, AppDispatch } from '@/redux/store';
import { cn } from '@/lib/utils';
import { loginFormSchema } from '@/types/authSchema';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { accessToken, user, error, isLoading } = useSelector((state: RootState) => state.auth);
  const [roleError, setRoleError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (accessToken && user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard',{ replace: true });
      } else {
        setRoleError('You are not authorized to access the admin panel');
        dispatch({ type: 'auth/clearUser' });
      }
    }
  }, [accessToken, user, navigate, dispatch]);

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setRoleError(null);
    const result = await dispatch(login({ ...data, role: 'admin' })).unwrap();
    if(login.fulfilled.match(result)){
      navigate("/admin/dashboard")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Admin Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {roleError && <p className="text-red-500 text-center">{roleError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                errors.email && 'border-red-500'
              )}
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                errors.password && 'border-red-500'
              )}
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600',
              isLoading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin

