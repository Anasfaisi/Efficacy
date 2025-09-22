import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect } from 'react';
import { fetchCurrentUser } from '@/Services/auth.api';
import { setCredentials } from '@/redux/slices/authSlice';

const SuccessPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshUser = async () => {
      try {
        const user = await fetchCurrentUser(); // call backend /me
        dispatch(setCredentials({ user })); // update redux with new user + subscription
      } catch (err) {
        console.error('Failed to refresh user after payment', err);
      }
    };

    refreshUser();
  }, [dispatch]);
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-lg p-10 max-w-lg w-full text-center"
      >
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Payment Successful 🎉
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Thank you for subscribing! Your account has been upgraded
          successfully. 🚀
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/home"
            className="px-6 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/home"
            className="px-6 py-3 border border-gray-300 rounded-xl shadow hover:bg-gray-100 transition"
          >
            View Profile
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
