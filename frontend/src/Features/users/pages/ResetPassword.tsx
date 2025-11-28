import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { useAppDispatch} from '@/redux/hooks';
// import { forgotPasswordRequest, resetPassword } from "@/redux/slices/authSlice";
import { forgotPasswordApi, resetPasswordApi } from '@/Services/auth.api';
import { AuthMessages } from '@/utils/Constants';

export function ForgotResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  // const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (token) {
        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match');
          setIsLoading(false);
          return;
        }
        const result = await resetPasswordApi(token, password);
        if (result) {
          setSuccessMessage(result.message);
          setTimeout(() => navigate('/login'), 1500);
        } else {
          setErrorMessage(AuthMessages.ResetPasswordFailed);
        }
      } else {
        const result = await forgotPasswordApi(email);
        if (result) {
          setSuccessMessage(result.message);
        } else {
          setErrorMessage(AuthMessages.ForgotFailed);
        }
      }
    } catch (err) {
      setErrorMessage(AuthMessages.ResetPasswordFailed);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full  max-w-md bg-white shadow-xl p-8 rounded-2xl border border-purple-300 ">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-1">
          {token ? 'Reset Password' : 'Forgot Password'}
        </h2>
        <p className="text-gray-600 text-center mb-6">
          {token
            ? 'Enter your new password below'
            : 'Enter your email and we’ll send you a reset link'}
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm mx-auto"
        >
          {!token && (
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none tranistion"
              required
            />
          )}
          {token && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition focus:outline-none"
                required
              />
            </>
          )}
          <button type="submit" disabled={isLoading}
          className='w-full py-2 bg-purple-600 text-white  font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50 ' >
            {isLoading
              ? token
                ? 'Resetting...'
                : 'Sending...'
              : token
                ? 'Reset Password'
                : 'Send Reset Link'}
          </button>
        </form>
        {errorMessage && <p className='text-red-600 text-center mt-4'>{errorMessage}</p>}
        {successMessage && (
          <p className='text-green-600 text-center mt-4'>
            {successMessage}{' '}
            {token && <button
            className='underline text-purple-700 ml-2'
            onClick={() => navigate('/login')}>Login</button>}
          </p>
        )}
      </div>
    </div>
  );
}
