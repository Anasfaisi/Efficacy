// client/src/pages/Login.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setCredentials } from '../../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema } from '@/types/zodSchemas';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { ForgotPasswordLink } from '@/Features/users/pages/ForgotPassowrd';
import { googleLoginApi, loginApi } from '@/Services/auth.api';
import type { CredentialResponse } from '@/types/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from '../../../../public/panda with laptop1.jpg';

const Login: React.FC = () => {
  const [googleError, setGoogleError] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { isLoading, error, currentUser } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: 'onChange',
  });
  useEffect(() => {
    if (currentUser?.role) {
      let endPoint = '/home';
      if (currentUser.role === 'admin') endPoint = '/admin/dashboard';
      if (currentUser.role === 'mentor') endPoint = '/mentor/dashboard';
      navigate(endPoint);
    }
  }, [navigate, currentUser]);

  const onSubmit = async (data: loginFormSchema) => {
    try {
      const { currentUser, message } = await loginApi({ ...data, role: 'user' });
      if (message) {
        toast.error(message);
        return;
      }
      if (currentUser) {
        dispatch(setCredentials({ currentUser }));
        navigate('/home');
        toast.success('Login successful!');
      }
    } catch (err) {
      console.error('Login failed:', err);

      toast.error(typeof err === 'string' ? err : 'Login failed');
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
      dispatch(setCredentials({ currentUser: result.user }));
    } else {
      setGoogleError('No Google credentials received');
    }
  };

  const handleGoogleError = () => {
    setGoogleError('Google authentication failed. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full max-w-4xl mx-4 bg-white/80 backdrop-blur-sm  shadow-xl rounded-3xl border  border-purple-100 flex flex-col md:flex-row overflow-hidden">
        <div
          className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Welcome Back
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
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <p>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </p>
            <p className="text-sm text-gray-500 text-center">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="hover:text-gray-700 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
          <div className="flex flex-col items-center justify-center gap-0">
            <ForgotPasswordLink />
          </div>
        </div>

         <div className="w-full flex-1 md:w-1/2 bg-gradient-to-tr from-purple-600 via-purple-500 to-purple-400 text-white flex items-center justify-center relative">
          {/* Glow circles */}
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-purple-900/20 blur-3xl" />

          <div className="relative p-8 md:p-10 flex flex-col items-center gap-4">
            {/* Tagline */}
            <div className="px-4 py-1.5 rounded-full bg-white/15 border border-white/30 text-xs uppercase tracking-wide backdrop-blur-sm">
              Let&apos;s get productive!
            </div>

            {/* Panda image */}
            <div className="mt-2 mb-3">
              {/* Replace src with your actual panda asset */}
              <img
                src={image}
                alt="Cute panda working on a laptop"
                className="max-w-[220px] md:max-w-[260px] drop-shadow-xl"
              />
            </div>

            <p className="text-sm text-purple-50/90 text-center max-w-xs">
              Your study, tasks, and mentor sessions all in one calm, focused
              workspace. Efficacy keeps your streak – you just show up.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
