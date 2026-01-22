import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCurrentUser } from '@/Services/user.api';
import { setCredentials } from '@/redux/slices/authSlice';
import { mentorshipApi } from '@/Services/mentorship.api';

const SuccessPage = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    const refreshUser = async () => {
        try {
            if (!currentUser?.id) return;
            const user = await fetchCurrentUser(currentUser?.id);
            dispatch(setCredentials({ currentUser: user }));
        } catch (err) {
            console.error('Failed to refresh user after payment', err);
        }
    };

    const navigate = useNavigate();

    const handleContinue = async () => {
        await refreshUser();
        try {
            const activeMentorship = await mentorshipApi.getActiveMentorship();
            if (activeMentorship?._id) {
                navigate(`/mentorship/${activeMentorship._id}`, { replace: true });
            } else {
                navigate('/mentors', { replace: true });
            }
        } catch (error) {
            console.error("Failed to fetch active mentorship", error);
            navigate('/mentors', { replace: true });
        }
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
                    Thank you for subscribing! Your mentorship session has been confirmed. 🚀
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        className="px-6 py-3 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
                        onClick={handleContinue}
                    >
                        Go to Mentorship
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default SuccessPage;
