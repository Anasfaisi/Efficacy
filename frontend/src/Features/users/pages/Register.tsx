import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTempUser } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/types/zodSchemas';
import type { RegisterFormData } from '@/types/zodSchemas';
import { registerInitApi } from '@/Services/auth.api';
import image from '../../../../public/panda with laptop1.jpg';

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const togglePasswordVisibility1 = () => {
    setShowPassword1(!showPassword1);
  };

  const dispatch = useAppDispatch();
  const { isLoading, error, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    const { name, email, password } = data;
    const result = await registerInitApi({
      name,
      email,
      password,
      role: 'user',
    });
    console.log(result.resendAvailableAt, 'from register');
    dispatch(
      setTempUser({
        email: result.tempEmail,
        role: result.role,
        resendAvailableAt: result.resendAvailableAt,
      }),
    );
    if (result) {
      navigate('/verify-otp');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-200">
      <div className="w-full max-w-4xl mx-4 bg-white/80 backdrop-blur-sm  shadow-xl rounded-3xl border  border-purple-100 flex flex-col md:flex-row overflow-hidden">
        {/*  Panda illustration */}
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
        <div
          className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            {' '}
            Create your Account{' '}
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
                  'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                  errors.name && 'border-red-500',
                )}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
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
              <div className="relative ">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...formRegister('password')}
                  placeholder="Enter your password"
                  className={cn(
                    'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ',
                    errors.password && 'border-red-500',
                  )}
                />
                <button
                  type="button"
                  className="border rounded-2xl w-17 absolute right-5 top-3"
                  onClick={togglePasswordVisibility}
                >
                  {' '}
                  {showPassword ? 'Hide' : 'show'}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showPassword1 ? 'text' : 'password'}
                  {...formRegister('confirmPassword')}
                  placeholder="Confirm your password"
                  className={cn(
                    'w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent',
                    errors.confirmPassword && 'border-red-500',
                  )}
                />
                <button
                  type="button"
                  className="border rounded-2xl w-17 absolute right-5 top-3"
                  onClick={togglePasswordVisibility1}
                >
                  {' '}
                  {showPassword1 ? 'Hide' : 'show'}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={cn(
                'w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500',
                { 'opacity-50 cursor-not-allowed': isLoading },
              )}
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Sign up'}
            </button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="hover:text-gray-700 hover:underline">
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Register;
