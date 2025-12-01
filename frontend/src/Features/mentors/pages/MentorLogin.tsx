import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '@/types/zodSchemas';
import { useForm } from 'react-hook-form';

import { GoogleLogin } from '@react-oauth/google';
// import { tr } from 'zod/v4/locales';
import { googleLoginApi, loginApi } from '@/Services/auth.api';
import type { CredentialResponse } from '@/types/auth';

const MentorLogin: React.FC = () => {
  const [googleError, setGoogleError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);
  useEffect(() => {
    if (user?.role) {
      let endPoint = '/home';
      if (user.role === 'admin') endPoint = '/admin/dashboard';
      if (user.role === 'mentor') endPoint = '/mentor/dashboard';
      navigate(endPoint);
    }
  }, [navigate, user]);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: loginFormSchema) => {
    const user = await loginApi({ ...data, role: 'mentor' });
    if (user) {
      dispatch(setCredentials({ user }));
      navigate('/home');
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse,
  ) => {
    setGoogleError(null);
    if (credentialResponse.credential) {
      const result = await googleLoginApi(
        credentialResponse.credential,
        'user',
      );
      dispatch(setCredentials({ user: result.user }));
    } else {
      setGoogleError('No Google credentials received');
    }
  };

  const handleGoogleError = () => {
    setGoogleError('Google authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Welcome Back Mentor
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {googleError && (
            <p className="text-red-500 text-sm text-center mt-2">
              {googleError}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...formRegister('email')}
              placeholder="Enter your email"
              className={cn(
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
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
                'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                errors.password && 'border-red-500',
              )}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={cn(
              'w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500',
              { 'opacity-50 cursor-not-allowed': isLoading },
            )}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in ...' : 'Log in'}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <p className="text-sm text-gray-500 text-center">
            Don’t have an account?{' '}
            <Link
              to="/mentor/register"
              className="hover:text-gray-700 hover:underline"
            >
              Mentor Sign up
            </Link>
          </p>

          <p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </p>
        </form>
      </div>
    </div>
  );
};
export default MentorLogin;
