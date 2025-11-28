import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setCredentials, setTempUser } from '@/redux/slices/authSlice';
import { resendOtpApi, verifyOtpApi } from '@/Services/auth.api';
import { toast } from 'react-toastify';
// import { verifyOtp, resendOtp } from "@/redux/slices/authSlice";

export function OTPPage() {
  const { tempEmail, isLoading, role, user, resendAvailableAt } =
    useAppSelector((state) => state.auth);

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState<number>(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(resendAvailableAt, 'insdien teh use efect');
    if (!resendAvailableAt) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const available = new Date(resendAvailableAt).getTime();
      const diffInSeconds = Math.max(0, Math.floor((available - now) / 1000));
      console.log(diffInSeconds);
      setTimer(diffInSeconds);
      if (diffInSeconds === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [resendAvailableAt]);

  useEffect(() => {
    if (user) {
      navigate('/home');
      return;
    }
    if (!tempEmail) {
      navigate('/signup');
    }
  }, [user, tempEmail]);

  const handleVerify = async () => {
    const result = await verifyOtpApi(tempEmail, otp, role);

    if (result.success) {
      dispatch(setCredentials({ user: result.user }));
      navigate('/home');
    } else {
      toast.error(result.message);
    }
  };

  const handleResend = async () => {
    try {
      const result = await resendOtpApi(tempEmail);
      if (result) {
        setOtp('');
        setTimer(30);
        dispatch(
          setTempUser({
            email: result.tempEmail,
            role: result.role,
            resendAvailableAt: result.resendAvailableAt,
          }),
        );
        toast.success(`Resend otp sent successfully`);
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unexpected error';

      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full max-w-2xl text-center bg-white shadow-2xl p-8 rounded-3xl border border-purple-300">
        <h2 className="text-2xl font-semibold text-purple-900 mb-2">
          Verify OTP
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          We sent an OTP to{' '}
          <span className="font-medium text-purple-600">{tempEmail}</span>
        </p>

        {/* OTP boxes */}
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          inputType="number"
          containerStyle={{ justifyContent: 'center', gap: '8px' }}
          renderInput={(props) => (
            <input
              {...props}
              className="
                 text-xl font-semibold rounded-t-md text-center 
                border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                bg-white shadow-sm
              "
            />
          )}
        />

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.length < 6}
          className="
            w-full mt-6 py-3 text-sm font-medium rounded-xl
            bg-gradient-to-r from-purple-500 to-purple-700 
            text-white shadow-md
            hover:brightness-110 transition
            disabled:opacity-40 disabled:cursor-not-allowed
          "
        >
          {isLoading ? 'Verifying...' : 'Verify'}
        </button>

        {/* Resend */}
        <div className="mt-5 text-sm">
          {timer > 0 ? (
            <span className="text-gray-500">
              Resend OTP in{' '}
              <span className="font-medium text-purple-700">
                00:{timer.toString().padStart(2, '0')}
              </span>
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-purple-600 font-medium underline hover:text-purple-800"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
