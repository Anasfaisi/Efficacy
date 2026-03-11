import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setTempUser } from '@/redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@/types/auth';
import { googleLoginApi, registerInitApi } from '@/Services/user.api';
import { setCredentials } from '@/redux/slices/authSlice';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerSchema } from '@/types/zodSchemas';
import type { RegisterFormData } from '@/types/zodSchemas';

const MentorRegister: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, currentUser } = useAppSelector((state) => state.auth);

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
        try {
            const result = await registerInitApi({
                ...data,
                role: 'mentor',
            });
            dispatch(
                setTempUser({
                    email: result.tempEmail,
                    role: result.role,
                    resendAvailableAt: result.resendAvailableAt,
                })
            );
            if (result.tempEmail) {
                toast.success(
                    'Professional account initiated. Verify your email.'
                );
                navigate('/mentor/verify-otp');
            }
        } catch (error: unknown) {
            console.log(error);
            toast.error('Registration failed. Please check your details.');
        }
    };

    const handleGoogleSuccess = async (
        credentialResponse: CredentialResponse
    ) => {
        if (credentialResponse.credential) {
            try {
                const result = await googleLoginApi(
                    credentialResponse.credential,
                    'mentor'
                );
                dispatch(setCredentials({ currentUser: result.user }));
                toast.success('Successfully logged in with Google');
            } catch (err: unknown) {
                console.log(err);
                toast.error('Google login failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh animate-gradient-slow p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl bg-white shadow-2xl rounded-[40px] flex flex-col md:flex-row overflow-hidden border border-slate-100"
            >
                {/* Left Side */}
                <div className="hidden md:flex md:w-[45%] bg-[#0284c7] p-12 text-white flex-col relative overflow-hidden">
                    {/* Brand Name Top Left */}
                    <div className="absolute top-8 left-8">
                        <h2 className="text-3xl font-black tracking-tight text-white cursor-default">
                            Efficacy Mentors
                        </h2>
                    </div>

                    {/* Centered Content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight"
                        >
                            Empower the Next.
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-lg text-white/90 leading-relaxed max-w-sm"
                        >
                            Your platform to guide, inspire, and foster
                            continuous growth.
                        </motion.p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-1 p-8 md:p-12 lg:p-16 bg-white overflow-y-auto">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-4xl font-black text-slate-800">
                                Professional Sign Up
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Join the Efficacy expert network.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    {...formRegister('name')}
                                    placeholder="Prof. John Doe"
                                    className={cn(
                                        'w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all',
                                        errors.name &&
                                            'border-red-400 bg-red-50 focus:ring-red-100'
                                    )}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs ml-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Work Email
                                </label>
                                <input
                                    type="email"
                                    {...formRegister('email')}
                                    placeholder="john@university.edu"
                                    className={cn(
                                        'w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all',
                                        errors.email &&
                                            'border-red-400 bg-red-50 focus:ring-red-100'
                                    )}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs ml-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        {...formRegister('password')}
                                        placeholder="••••••••"
                                        className={cn(
                                            'w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all pr-14',
                                            errors.password &&
                                                'border-red-400 bg-red-50 focus:ring-red-100'
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-xs ml-1">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    {...formRegister('confirmPassword')}
                                    placeholder="••••••••"
                                    className={cn(
                                        'w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all',
                                        errors.confirmPassword &&
                                            'border-red-400 bg-red-50 focus:ring-red-100'
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-xs ml-1">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-4"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    'Begin Application'
                                )}
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-400">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => {
                                        toast.error(
                                            'Google authentication failed'
                                        );
                                    }}
                                    theme="outline"
                                    shape="circle"
                                    width="100%"
                                />
                            </div>

                            <p className="text-center text-slate-500 text-sm mt-8">
                                Already a mentor?{' '}
                                <Link
                                    to="/mentor/login"
                                    className="text-primary font-bold hover:underline"
                                >
                                    Log In
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MentorRegister;
