// client/src/pages/Login.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { login } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error, token } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');


  useEffect(() => {
    console.log("use effect worked")
    console.log(token)
    if (token) {
      console.log('Token detected in useEffect:', token);
      navigate('/home');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    console.log("Result after submitting form:", result);
    if (login.fulfilled.match(result)) {
      console.log('Login fulfilled, state should update');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className={cn('w-full max-w-md p-6 bg-white rounded-xl shadow-lg')}>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>
          <button
            type="submit"
            className={cn(
              'w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 active:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500',
              { 'opacity-50 cursor-not-allowed': isLoading }
            )}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <p className="text-sm text-gray-500 text-center">
            Don’t have an account?{' '}
            <Link to="/register" className="hover:text-gray-700 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;