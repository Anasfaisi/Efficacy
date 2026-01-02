import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';
import { type Mentor } from '@/types/auth';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function ApplicationRejected() {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser?.role === 'mentor') {
      const mentor = currentUser as Mentor;
      const status = mentor.status;

      if (status === 'pending') {
        navigate('/mentor/application-received');
      } else if (status === 'reapply' || status === 'incomplete' || !status) {
        navigate('/mentor/onboarding');
      } else if (status === 'active' || status === 'approved') {
        navigate('/mentor/dashboard');
      }
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-red-100">
        <div className="mb-6 flex justify-center">
          <div className="h-24 w-24 bg-red-50 rounded-full flex items-center justify-center animate-bounce">
            <XCircle className="w-12 h-12 text-red-500" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Application Rejected
        </h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          We regret to inform you that your application to join as a mentor has been rejected by our administration team.
          <br /><br />
          Unfortunately, at this stage, we cannot proceed with your profile. Thank you for your interest in our platform.
        </p>

        <button
          onClick={() => navigate('/')}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-900 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Return to Home
        </button>
      </div>
    </div>
  );
}
