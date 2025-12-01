
import React, { useState } from 'react';
import { forgotPasswordApi, resetPasswordApi } from '@/Services/auth.api';
import { AuthMessages } from '@/utils/Constants';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const ForgotResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const token = new URLSearchParams(location.search).get('token');

  // State-based form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Password validation regex
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handlePassword = (data: string) => {
    if (!passwordRegex.test(data)) {
      setErrorMessage(
        'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.',
      );
    } else {
      setErrorMessage('');
    }
    setPassword(data);
  };
  const handleConfirmPassword = (data: string) => {
    if (!passwordRegex.test(data)) {
      setErrorMessage(
        'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.',
      );
    } else {
      setErrorMessage('');
    }
    setConfirmPassword(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (token) {
        if (!passwordRegex.test(password)) {
          setErrorMessage(
            'Password must be at least 8 characters, contain uppercase, lowercase, number, and special character.',
          );
          setIsLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          setIsLoading(false);
          return;
        }

        const result = await resetPasswordApi(token, password);
        if (result) {
          setTimeout(() => navigate('/login'), 1500);
          toast.success(result.message);
        } else {
          setErrorMessage(AuthMessages.ResetPasswordFailed);
        }

        return;
      } else {
        if (!email) {
          setErrorMessage('Email is required');
          setIsLoading(false);
          return;
        }
        if (emailRegex.test(email) == false) {
          setErrorMessage('please Enter a valid email');
          return;
        }
        const result = await forgotPasswordApi(email);
        if (result) {
          setSuccessMessage(result.message);
        } else {
          setErrorMessage(AuthMessages.ForgotFailed);
        }
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === 'string'
            ? error
            : 'An unexpected error occurred';

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl p-8 rounded-2xl border border-purple-300">
        <h2 className="text-3xl font-bold text-purple-900 text-center mb-3">
          {token ? 'Reset Password' : 'Forgot Password'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* EMAIL FIELD */}
          {!token && (
            <div>
              <input
                type="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          )}

          {/* PASSWORD FIELDS */}
          {token && (
            <>
              <input
                type="password"
                value={password}
                placeholder="New Password"
                onChange={(e) => handlePassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <input
                type="password"
                value={confirmPassword}
                placeholder="Confirm New Password"
                onChange={(e) => handleConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </>
          )}

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-sm">{successMessage}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isLoading
              ? token
                ? 'Resetting...'
                : 'Sending...'
              : token
                ? 'Reset Password'
                : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
};
