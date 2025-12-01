import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '@/redux/slices/authSlice';
import type { RootState, AppDispatch } from '@/redux/store';
import { cn } from '@/lib/utils';
import { loginFormSchema } from '@/types/zodSchemas';
import { adminLoginApi } from '@/Services/auth.api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, error, isLoading } = useSelector(
    (state: RootState) => state.auth,
  );
  const [roleError, setRoleError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (user?.role) {
      let endPoint = '/home';
      if (user.role === 'admin') endPoint = '/admin/dashboard';
      if (user.role === 'mentor') endPoint = '/mentor/dashboard';
      navigate(endPoint);
    }
  }, [navigate, user]);

  const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
    setRoleError(null);
    const  admin  = await adminLoginApi({ ...data, role: 'admin' });
    console.log(admin,"from the adminLogin")
    if (admin) {
      dispatch(setCredentials({ user:admin }));
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Admin Login
        </h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {roleError && <p className="text-red-500 text-center">{roleError}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="Enter your email"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                errors.email && 'border-red-500',
              )}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              placeholder="Enter your password"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                errors.password && 'border-red-500',
              )}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600',
              isLoading && 'opacity-50 cursor-not-allowed',
            )}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
