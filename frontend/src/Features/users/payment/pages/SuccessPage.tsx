import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCurrentUser } from '@/Services/user.api';
import { setCredentials } from '@/redux/slices/authSlice';

const SuccessPage = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user);

  const refreshUser = async () => {
    try {
      if (!userId?.id) return;
      const user = await fetchCurrentUser(userId?.id);
      dispatch(setCredentials({ user }));
    } catch (err) {
      console.error('Failed to refresh user after payment', err);
    }
  };

  const navigate = useNavigate();

  const goToSubscription = async () => {
    await refreshUser();
    navigate('/subscription', { replace: true });
  };

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
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
            onClick={goToSubscription}
          >
            subscription details
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
