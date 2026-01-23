import React, { useState } from 'react';
import { mentorApi } from '@/Services/mentor.api'; // Updated API
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { KeyRound, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';

export const MentorForgotResetPassword: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            if (token) {
                if (!passwordRegex.test(password)) {
                    setErrorMessage(
                        'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.'
                    );
                    setIsLoading(false);
                    return;
                }
                if (password !== confirmPassword) {
                    setErrorMessage('Passwords do not match.');
                    setIsLoading(false);
                    return;
                }

                const result = await mentorApi.resetPassword(token, password);
                if (result) {
                    toast.success(
                        result.message || 'Password reset successful!'
                    );
                    setTimeout(() => navigate('/mentor/login'), 2000);
                }
            } else {
                if (!emailRegex.test(email)) {
                    setErrorMessage('Please enter a valid email address.');
                    setIsLoading(false);
                    return;
                }
                const result = await mentorApi.forgotPassword(email);
                if (result) {
                    toast.success(
                        result.message || 'Reset link sent to your email.'
                    );
                }
            }
        } catch (error: unknown) {
            console.log(error, 'error');
            const message =
                error instanceof Error
                    ? (error as any)?.response?.data?.message
                    : error?.message || 'Verification failed';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh animate-gradient-slow p-4">
            {/* Logo */}
            <div className="absolute top-8 left-8">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white shadow-2xl rounded-[40px] p-8 md:p-12 border border-slate-100"
            >
                <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 mx-auto mb-8">
                    <KeyRound size={40} />
                </div>

                <h2 className="text-3xl font-black text-slate-800 text-center mb-3">
                    {token ? 'Reset Mentor Password' : 'Forgot Mentor Password'}
                </h2>
                <p className="text-slate-500 text-center mb-10 px-4">
                    {token
                        ? 'Set a new strong password for your mentor account.'
                        : "Enter your email and we'll send you a link to reset your password."}
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {!token ? (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    size={20}
                                />
                                <input
                                    type="email"
                                    value={email}
                                    placeholder="your@email.com"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={20}
                                    />
                                    <input
                                        type="password"
                                        value={password}
                                        placeholder="••••••••"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        size={20}
                                    />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        placeholder="••••••••"
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {errorMessage && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center">
                            {errorMessage}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-600/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : token ? (
                            'Reset Password'
                        ) : (
                            'Send Reset Link'
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/mentor/login')}
                        className="w-full py-4 text-slate-500 font-bold flex items-center justify-center gap-2 hover:text-slate-700 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Back to Login
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
