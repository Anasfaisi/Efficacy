import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type loginFormSchemaType } from '@/types/zodSchemas';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { googleLoginApi, loginApi } from '@/Services/user.api';
import type { CredentialResponse } from '@/types/auth';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';

const MentorLogin: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { isLoading, currentUser } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (currentUser?.role) {
            let endPoint = '/home';
            if (currentUser.role === 'admin') endPoint = '/admin/dashboard';
            if (currentUser.role === 'mentor') endPoint = '/mentor/dashboard';
            navigate(endPoint);
        }
    }, [navigate, currentUser]);

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<loginFormSchemaType>({
        resolver: zodResolver(loginFormSchema),
        mode: 'onChange',
    });

    const onSubmit = async (data: loginFormSchemaType) => {
        try {
            const result = await loginApi({ ...data, role: 'mentor' });
            if (result.user) {
                dispatch(setCredentials({ currentUser: result.user }));
                toast.success('Welcome back, Mentor!');
            } else if (result.message) {
                toast.error(result.message);
            }
        } catch (err: unknown) {
            toast.error('Login failed. Please check your credentials.');
            console.log(err);
        }
    };

    const handleGoogleSuccess = async (
        credentialResponse: CredentialResponse
    ) => {
        setGoogleError(null);
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
                setGoogleError('Google login failed');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh animate-gradient-slow p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
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
                <div className="flex-1 p-8 md:p-16 lg:p-20 bg-white">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-4xl font-black text-slate-800">
                                Welcome Back
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Mentor Access Portal
                            </p>
                        </div>

                        {googleError && (
                            <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center">
                                {googleError}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Work Email
                                </label>
                                <input
                                    type="email"
                                    {...formRegister('email')}
                                    placeholder="mentor@efficacy.com"
                                    className={cn(
                                        'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all',
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

                            <div className="space-y-2 group">
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
                                            'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all pr-14',
                                            errors.password &&
                                                'border-red-400 bg-red-50 focus:ring-red-100'
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2  hover:bg-slate-200 rounded-xl transition-colors text-slate-400"
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

                            <div className="flex justify-end pr-1">
                                <Link
                                    to="/mentor/forgot-password"
                                    className="text-sm font-bold text-accent hover:underline decoration-2 underline-offset-4 transition-all"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-sky-600 text-white rounded-2xl font-bold text-lg shadow-sm shadow-sky-600 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <>
                                        <LogIn size={20} /> Log in
                                    </>
                                )}
                            </button>

                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-slate-400">
                                        Or use Google
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() =>
                                        setGoogleError(
                                            'Google authentication failed'
                                        )
                                    }
                                    theme="outline"
                                    shape="circle"
                                    width="100%"
                                />
                            </div>

                            <p className="text-center text-slate-500 text-sm mt-8">
                                New here?{' '}
                                <Link
                                    to="/mentor/register"
                                    className="text-primary font-bold hover:underline"
                                >
                                    Apply as a Mentor
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default MentorLogin;
