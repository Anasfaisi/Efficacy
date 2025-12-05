import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTempUser } from '../../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/types/zodSchemas';
import type { RegisterFormData } from '@/types/zodSchemas';
import { registerInitApi } from '@/Services/auth.api';

const MentorRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error,currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/mentor/dashboard');
    }
  }, [currentUser, navigate]);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { name, email, password } = data;
    const result = await registerInitApi({
      name,
      email,
      password,
      role: 'mentor',
    });
    dispatch(setTempUser({ email: result.tempEmail, role: result.role ,resendAvailableAt:result.resendAvailableAt}));
    console.log(result, 'from result in mentor login');
    if (result.tempEmail) {
      navigate('/verify-otp');
    }
  };

  return (
    <div className="min-h-screen flex items-center  justify-center">
      <div className={cn('w-full max-w-md p-6 rounded-xl shadow-lg')}>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          {' '}
          Create Your Mentor Account{' '}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              {...formRegister('name')}
              placeholder="Enter your name"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
                errors.name && 'border-red-500',
              )}
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...formRegister('email')}
              placeholder="Enter your email"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
                errors.email && 'border-red-500',
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...formRegister('password')}
              placeholder="Enter your password"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
                errors.password && 'border-red-500',
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              {...formRegister('confirmPassword')}
              placeholder="Confirm your password"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent',
                errors.confirmPassword && 'border-red-500',
              )}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={cn(
              'w-full  bg-sky-600  text-white p-3 rounded-lg hover:bg-sky-700 active:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-500',
              { 'opacity-50 cursor-not-allowed': isLoading },
            )}
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Sign up'}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <p className="text-sm text-gray-500 text-center">
            Already have an account?{' '}
            <Link
              to="/mentor/login"
              className="hover:text-gray-700 hover:underline"
            >
              Mentor Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default MentorRegister;
