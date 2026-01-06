import React, { useState } from 'react';
import {
    CheckCircle,
    ArrowRight,
    IndianRupee,
    ShieldCheck,
    BookOpen,
    Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { mentorApi } from '@/Services/mentor.api';
import { updateCurrentUser } from '@/redux/slices/authSlice';
import { toast } from 'sonner';

const MentorApproved: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);

    const [activeStep, setActiveStep] = useState(1);
    const [monthlyCharge, setMonthlyCharge] = useState<string>('1500');
    const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleActivate = async () => {
        if (!monthlyCharge || parseFloat(monthlyCharge) <= 0) {
            toast.error('Please enter a valid monthly charge');
            return;
        }
        if (!agreedToGuidelines) {
            toast.error('Please agree to the guidelines');
            return;
        }
        if (!isReady) {
            toast.error('Please confirm you are ready');
            return;
        }

        setIsLoading(true);
        try {
            const response = await mentorApi.activateMentor(
                parseFloat(monthlyCharge),
            );

            // Update local user state
            dispatch(updateCurrentUser(response.user));

            toast.success('Account activated successfully!');
            navigate('/mentor/dashboard');
        } catch (error: any) {
            console.error('Activation failed:', error);
            toast.error(error.response?.data?.message || 'Activation failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#7F00FF] px-8 py-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white blur-xl"></div>
                        <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white blur-xl"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 ring-4 ring-white/10">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Application Approved!
                        </h1>
                        <p className="text-purple-100 max-w-sm mx-auto">
                            Congratulations{' '}
                            {'name' in (currentUser || {})
                                ? (currentUser as any).name
                                : 'Mentor'}
                            , you are almost there.
                        </p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="space-y-8">
                        {/* Step 1: Guidelines */}
                        <div
                            className={`transition-all duration-300 ${activeStep === 1 ? 'opacity-100' : 'opacity-50 blur-[1px]'}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Review Guidelines
                                </h3>
                            </div>

                            <div className="ml-11 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
                                <div className="flex gap-3 mb-3">
                                    <BookOpen className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div className="text-sm text-gray-600 space-y-2">
                                        <p>
                                            • Be respectful and professional
                                            with all mentees.
                                        </p>
                                        <p>
                                            • Sessions should be conducted
                                            within the platform.
                                        </p>
                                        <p>
                                            • Response time should be within
                                            24-48 hours.
                                        </p>
                                    </div>
                                </div>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={agreedToGuidelines}
                                        onChange={(e) => {
                                            setAgreedToGuidelines(
                                                e.target.checked,
                                            );
                                            if (
                                                e.target.checked &&
                                                activeStep === 1
                                            )
                                                setActiveStep(2);
                                        }}
                                        className="w-5 h-5 rounded border-gray-300 text-[#7F00FF] focus:ring-[#7F00FF] transition-all"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                        I have read and agree to the Mentor
                                        Guidelines
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Step 2: Rate */}
                        <div
                            className={`transition-all duration-300 ${activeStep === 2 ? 'opacity-100' : 'opacity-50 blur-[1px]'}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Confirm Your Rate
                                </h3>
                            </div>

                            <div className="ml-11 mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monthly Mentorship Charge (₹)
                                </label>
                                <div className="relative">
                                    <IndianRupee
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        type="number"
                                        value={monthlyCharge}
                                        onChange={(e) =>
                                            setMonthlyCharge(e.target.value)
                                        }
                                        onFocus={() => setActiveStep(2)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF] outline-none transition-all font-semibold text-gray-900"
                                        placeholder="1500"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    This is what students will pay per month.
                                    You can update this later in settings.
                                </p>
                            </div>
                        </div>

                        {/* Step 3: Activation */}
                        <div
                            className={`transition-all duration-300 ${activeStep >= 2 ? 'opacity-100' : 'opacity-50 blur-[1px]'}`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                    3
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    Ready to Activate?
                                </h3>
                            </div>

                            <div className="ml-11">
                                <label className="flex items-center gap-3 cursor-pointer group mb-6">
                                    <input
                                        type="checkbox"
                                        checked={isReady}
                                        onChange={(e) => {
                                            setIsReady(e.target.checked);
                                            if (e.target.checked)
                                                setActiveStep(3);
                                        }}
                                        className="w-5 h-5 rounded border-gray-300 text-[#7F00FF] focus:ring-[#7F00FF] transition-all"
                                    />
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                                        I confirm that my profile is accurate
                                        and I am ready to accept mentees.
                                    </span>
                                </label>

                                <button
                                    onClick={handleActivate}
                                    disabled={
                                        !agreedToGuidelines ||
                                        !isReady ||
                                        !monthlyCharge ||
                                        isLoading
                                    }
                                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-[#7F00FF] text-white font-bold rounded-xl hover:bg-[#6c00db] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#7F00FF]/25 hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Activating...
                                        </>
                                    ) : (
                                        <>
                                            Activate & Go to Dashboard
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorApproved;
