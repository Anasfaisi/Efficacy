import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { type Mentor } from '@/types/auth';
import { logout } from '@/redux/slices/authSlice';
import { motion } from 'framer-motion';
import { CheckCircle, Home, Mail, LogOut } from 'lucide-react';

export default function ApplicationReceived() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser?.role === 'mentor') {
      const mentor = currentUser as Mentor;
      const status = mentor.status;
      console.log(status);

      if (status === 'incomplete' || !status) {
        navigate('/mentor/onboarding');
      } else if (
        status === 'active' ||
        (status && status !== 'incomplete' && status !== 'pending')
      ) {
        navigate('/mentor/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    // Dispatch logout action and navigate to login/home
    await dispatch(logout());
    navigate('/mentor/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-lg w-full"
      >
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="bg-sky-50 p-8 flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.2,
                type: 'spring',
                stiffness: 200,
                damping: 10,
              }}
              className="bg-white p-4 rounded-full shadow-sm"
            >
              <CheckCircle className="w-16 h-16 text-sky-500" />
            </motion.div>
          </div>

          <div className="p-8 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Application Received!
              </h2>
              <p className="text-slate-600">
                Thank you for completing the mentor application.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-sky-50 rounded-xl p-6 text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-sky-100 rounded-lg shrink-0">
                  <Mail className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    What happens next?
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Our team will review your details.It will   <span className="font-medium text-slate-900">
                    take up to 3
                    </span>{' '}  working days.Please{' '}
                    <span className="font-medium text-slate-900">
                      login with the same email address
                    </span>{' '}
                    to receive updates on your application status.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
             <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 w-full sm:w-auto"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          </div>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-slate-400 text-sm mt-8"
        >
          © 2025 Efficacy. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
