import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials, setTempUser } from '@/redux/slices/authSlice';
import { mentorApi } from '@/Services/mentor.api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Loader2, RefreshCw } from 'lucide-react';
import type { Role } from '@/types/auth';

export function MentorOtpPage() {
    const { tempEmail, isLoading, currentUser, resendAvailableAt, role } =
        useAppSelector((state) => state.auth);
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState<number>(0);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!resendAvailableAt) return;
        const interval = setInterval(() => {
            const now = Date.now();
            const available = new Date(resendAvailableAt).getTime();
            const diffInSeconds = Math.max(
                0,
                Math.floor((available - now) / 1000)
            );
            setTimer(diffInSeconds);
            if (diffInSeconds === 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendAvailableAt]);

    useEffect(() => {
        if (!currentUser) return;
        if (currentUser.role === 'mentor') {
            navigate('/mentor/dashboard');
        }
    }, [currentUser, navigate]);

    const handleVerify = async () => {
        try {
            const result = await mentorApi.verifyOtp({
                email: tempEmail!,
                otp,
                role: role as Role,
            });

            if (result) {
                dispatch(setCredentials({ currentUser: result }));
                toast.success('Mentor email verified successfully!');
                navigate('/mentor/dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || 'Verification failed');
        }
    };

    const handleResend = async () => {
        try {
            const result = await mentorApi.resendOtp(tempEmail!);
            setOtp('');
            dispatch(
                setTempUser({
                    email: result.email,
                    role: result.role,
                    resendAvailableAt: result.resendAvailableAt,
                })
            );
            toast.success(`A new verification code has been sent.`);
        } catch (error: unknown) {
            const message =
                typeof error === 'string' ? error : 'Failed to resend OTP';
            toast.error(message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-mesh animate-gradient-slow p-4">
            <div className="absolute top-8 left-8">
                <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg bg-white shadow-2xl rounded-[40px] p-8 md:p-12 border border-slate-100 text-center"
            >
                <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center text-purple-600 mx-auto mb-8">
                    <ShieldCheck size={40} />
                </div>

                <h2 className="text-3xl font-black text-slate-800 mb-3">
                    Verify Mentor Email
                </h2>
                <div className="flex items-center justify-center gap-2 text-slate-500 mb-10">
                    <Mail size={16} />
                    <p className="text-sm">
                        Sent to{' '}
                        <span className="font-bold text-slate-700">
                            {tempEmail}
                        </span>
                    </p>
                </div>

                <div className="mb-10">
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        renderInput={(props) => (
                            <input
                                {...props}
                                className="w-12 h-14 md:w-14 md:h-16 text-2xl font-bold rounded-2xl border border-slate-200 bg-slate-50 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 focus:bg-white outline-none transition-all mx-1 md:mx-2"
                            />
                        )}
                        containerStyle="justify-center"
                    />
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isLoading || otp.length < 6}
                    className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-600/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-8"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" />
                    ) : (
                        'Verify Code'
                    )}
                </button>

                <div className="pt-6 border-t border-slate-100">
                    {timer > 0 ? (
                        <p className="text-slate-500 text-sm">
                            Resend available in{' '}
                            <span className="font-bold text-purple-600">
                                {timer}s
                            </span>
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            className="text-purple-600 font-bold hover:underline flex items-center gap-2 mx-auto"
                        >
                            <RefreshCw size={16} />
                            Resend Verification Code
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
