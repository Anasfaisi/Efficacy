import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials } from '@/redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginFormSchema, type loginFormSchemaType } from '@/types/zodSchemas';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from '@react-oauth/google';
import { ForgotPasswordLink } from '@/Features/users/pages/ForgotPassowrd';
import { googleLoginApi, loginApi } from '@/Services/user.api';
import type { CredentialResponse } from '@/types/auth';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { isLoading, currentUser } = useAppSelector((state) => state.auth);

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<loginFormSchemaType>({
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

    const onSubmit = async (data: loginFormSchemaType) => {
        try {
            const result = await loginApi({ ...data, role: 'user' });
            if (result.message && !result.user) {
                toast.error(result.message);
                return;
            }
            if (result.user) {
                dispatch(setCredentials({ currentUser: result.user }));
                toast.success('Welcome back to Efficacy!');
            }
        } catch (err: unknown) {
            const errorMessage =
                typeof err === 'string'
                    ? err
                    : 'Login failed. Please check your credentials.';
            toast.error(errorMessage);
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
                    'user'
                );
                dispatch(setCredentials({ currentUser: result.user }));
                toast.success('Successfully logged in with Google');
            } catch (err: unknown) {
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
                {/* Left Side (Flipped for Login) - Mascot */}
                <div className="hidden md:flex md:w-[45%] bg-purple-600 opacity-90 p-12 text-white flex-col items-center justify-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col items-center gap-8">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
                        >
                            Welcome Back!
                        </motion.div>

                        <motion.img
                            src="/panda-logo.png"
                            alt="Efficacy Mascot"
                            className="w-64 h-64 drop-shadow-2xl animate-float"
                        />

                        <div className="text-center space-y-4 max-w-sm">
                            <h3 className="text-2xl text-white font-bold">
                                Pick up where you left
                            </h3>
                            <p className="leading-relaxed text-sm text-white">
                                Consistency is the key to mastery. Log in to
                                access your planner, timer, and mentorship
                                sessions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex-1 p-8 md:p-16 lg:p-20 bg-white">
                    <div className="max-w-md mx-auto">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-4xl font-black text-slate-800">
                                Login
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Enter your credentials to access your workspace.
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
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...formRegister('email')}
                                    placeholder="admin@gmail.com"
                                    className={cn(
                                        'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all',
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
                                            'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all pr-14',
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

                            <div className="flex justify-end pr-1">
                                <ForgotPasswordLink />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-purple-600 py-4 bg-accent text-white rounded-2xl font-bold text-lg shadow-xl shadow-accent/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                                        Or continue with
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
                                Don't have an account?{' '}
                                <Link
                                    to="/register"
                                    className="text-accent font-bold hover:underline"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
