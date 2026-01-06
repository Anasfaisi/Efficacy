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
import { adminLoginApi } from '@/Services/user.api';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, EyeOff, Loader2, LogIn } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentUser, isLoading } = useSelector(
        (state: RootState) => state.auth,
    );

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof loginFormSchema>>({
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

    const onSubmit = async (data: z.infer<typeof loginFormSchema>) => {
        try {
            const result = await adminLoginApi({ ...data, role: 'admin' });
            if (result.admin) {
                dispatch(setCredentials({ currentUser: result.admin }));
                toast.success('Admin authorized successfully');
                navigate('/admin/dashboard');
            }
        } catch (err: unknown) {
            toast.error('Admin authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh animate-gradient-slow p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white shadow-2xl rounded-[40px] p-8 md:p-12 border border-slate-100"
            >
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl">
                    <ShieldCheck size={40} />
                </div>

                <h2 className="text-3xl font-black text-slate-800 text-center mb-3">
                    Admin Panel
                </h2>
                <p className="text-slate-500 text-center mb-10">
                    Restricted Access Area
                </p>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                            Admin Email
                        </label>
                        <input
                            type="email"
                            {...register('email')}
                            placeholder="admin@efficacy.com"
                            className={cn(
                                'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-800 outline-none transition-all',
                                errors.email &&
                                    'border-red-400 bg-red-50 focus:ring-red-100',
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
                                type={showPassword ? 'text' : 'password'}
                                {...register('password')}
                                placeholder="••••••••"
                                className={cn(
                                    'w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-slate-100 focus:border-slate-800 outline-none transition-all pr-14',
                                    errors.password &&
                                        'border-red-400 bg-red-50 focus:ring-red-100',
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <LogIn size={20} /> Authorize
                            </>
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full text-slate-400 font-bold hover:text-slate-600 transition-colors py-2"
                    >
                        Return to Site
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
