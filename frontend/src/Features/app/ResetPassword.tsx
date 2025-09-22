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
  console.log(token);

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
    <div style={{ textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <h2>{token ? 'Reset Password' : 'Forgot Password'}</h2>
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
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading
            ? token
              ? 'Resetting...'
              : 'Sending...'
            : token
              ? 'Reset Password'
              : 'Send Reset Link'}
        </button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && (
        <p style={{ color: 'green' }}>
          {successMessage}{' '}
          {token && <button onClick={() => navigate('/login')}>Login</button>}
        </p>
      )}
    </div>
  );
}
