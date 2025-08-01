
// src/components/Login.tsx
import React, { useState,useEffect } from 'react';
import { loginStart, loginSuccess, loginFailure } from '@/redux/slices/authSlice';
import { loginUser } from '@/ApiServices/api';
import { useNavigate } from 'react-router-dom';
import { useAppSelector ,useAppDispatch} from '@/redux/hooks';

const Login = () => {
  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state:any) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


  interface LoginFormData {
    email: string;
    password: string;
  }

  interface LoginUserResponse {
    accessToken: string;
    user: any; // Replace 'any' with your User type if available
  }

  interface AuthError extends Error {
    message: string;
  }
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const data: LoginUserResponse = await loginUser({ email, password });
      console.log(data,"data")
      dispatch(loginSuccess({
        accessToken: data.accessToken,
        user: data.user,
      }));
      navigate('/dashboard', { replace: true });
    } catch (error: unknown) {
      const err = error as AuthError;
      dispatch(loginFailure(err.message || 'Login failed'));
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;



