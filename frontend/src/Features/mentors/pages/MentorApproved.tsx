import React from 'react';
import { 
  CheckCircle, 
  ArrowRight, 
  Trophy, 
  Award, 
  Settings,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/redux/hooks';

const MentorApproved: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <CheckCircle className="w-24 h-24 text-green-500 animate-pulse" />
            <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
              <Star className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Application Approved!
        </h1>
        <p className="text-slate-600 mb-8">
          Congratulations {('name' in (currentUser || {}) ? (currentUser as any).name : 'Mentor') || 'Mentor'}, you are now officially part of the Efficacy Mentor Network.
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4 text-left">
            <Trophy className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Update Your Achievements</h4>
              <p className="text-xs text-slate-500">Go to your profile and add your national level exam scores or industry milestones.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4 text-left">
            <Award className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Add Extra Skills</h4>
              <p className="text-xs text-slate-500">List specialized technical or psychological guidance skills to stand out to students.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-4 text-left">
            <Settings className="w-6 h-6 text-slate-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Configure Payment</h4>
              <p className="text-xs text-slate-500">Your initial monthly charge is set. You can refine this in the payment settings.</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/mentor/guidelines')}
          className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
        >
          Review Guidelines & Activate
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MentorApproved;
