import React, { useState } from 'react';
import {
    HelpCircle,
    Clock,
    TrendingUp,
    HeartHandshake,
    BookOpen,
    Briefcase,
    AlertCircle,
    Currency,
    CheckCircle,
    Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { mentorApi } from '@/Services/mentor.api';
import { setCredentials } from '@/redux/slices/authSlice';
import { toast } from 'sonner';
import { type Mentor } from '@/types/auth';

const MentorGuidelines: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentUser } = useAppSelector((state) => state.auth);

    const isApproved =
        currentUser?.role === 'mentor' &&
        (currentUser as Mentor).status === 'approved';

    const [monthlyCharge, setMonthlyCharge] = useState<number>(
        (currentUser as Mentor)?.monthlyCharge || 2000
    );
    const [isActivating, setIsActivating] = useState(false);

    const handleActivate = async () => {
        if (monthlyCharge < 1500 || monthlyCharge > 2000) {
            toast.error(
                'Charge must be between ₹1500 and ₹2000 during initial phase'
            );
            return;
        }

        try {
            setIsActivating(true);
            await mentorApi.activateMentor(monthlyCharge);

            if (currentUser) {
                dispatch(
                    setCredentials({
                        currentUser: {
                            ...currentUser,
                            status: 'active',
                            monthlyCharge,
                        } as Mentor,
                    })
                );
            }

            toast.success('Your profile is now active!');
            navigate('/mentor/dashboard');
        } catch (error: unknown) {
            const errorMsg =
                error instanceof Error ? error.message : 'Activation failed';
            toast.error(errorMsg);
        } finally {
            setIsActivating(false);
        }
    };

    const guidelines = [
        {
            icon: <HeartHandshake className="w-8 h-8 text-blue-500" />,
            title: 'Support vs. Solving',
            description:
                'Our mission is to help students find their own path. Support and shape them by guiding them towards solutions rather than just solving their problems for them.',
        },
        {
            icon: <HelpCircle className="w-8 h-8 text-purple-500" />,
            title: 'Psychological Comfort',
            description:
                'Many students deal with basic psychological hurdles. Your role is to listen, comfort, and suggest solutions that help them navigate these challenges.',
        },
        {
            icon: <Clock className="w-8 h-8 text-orange-500" />,
            title: 'Patience is Mandatory',
            description:
                'Mentoring requires immense patience. If you lack the ability to stay calm and persistent with students, this platform may not be for you.',
        },
        {
            icon: <TrendingUp className="w-8 h-8 text-emerald-500" />,
            title: 'Payment & Growth',
            description:
                'During your initial 2 months or first 10 sessions, your charge is capped between ₹1500 to ₹2000 per month. As your reviews and ratings improve, you can increase your fees.',
        },
        {
            icon: <BookOpen className="w-8 h-8 text-indigo-500" />,
            title: 'Academic Mentors',
            description:
                'Guide students through national-level exams and academic hurdles. Highlight your achievements and skills to attract more students.',
        },
        {
            icon: <Briefcase className="w-8 h-8 text-slate-700" />,
            title: 'Industry Mentors',
            description:
                'Share career guidance and industry insights. Help students bridge the gap between academia and the professional world.',
        },
    ];

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl">
                        Mentor <span className="text-blue-600">Guidelines</span>
                    </h1>
                    <p className="mt-4 text-xl text-slate-600">
                        {isApproved
                            ? 'Final steps to activate your professional profile.'
                            : 'Everything you need to know about being a mentor on our platform.'}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-slate-100">
                    <div className="p-8 grid gap-8 md:grid-cols-2">
                        {guidelines.map((guide, index) => (
                            <div
                                key={index}
                                className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    {guide.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">
                                        {guide.title}
                                    </h3>
                                    <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                                        {guide.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-slate-100">
                    <div className="px-8 py-6 bg-slate-900 text-white">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-blue-400" />
                            How It Works
                        </h2>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                                1
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                You will act as a{' '}
                                <span className="font-bold text-slate-900">
                                    Personal Guider
                                </span>{' '}
                                for career, job applications, and emotional
                                support during the subscribed period.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                                2
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                Conduct{' '}
                                <span className="font-bold text-blue-600 underline decoration-blue-300">
                                    regular sessions on alternative days
                                </span>
                                . Each session should last for approximately{' '}
                                <span className="font-bold text-slate-900">
                                    30 minutes
                                </span>
                                .
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                                3
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                Our tool will handle session scheduling. You can
                                choose your preference for{' '}
                                <span className="font-bold text-slate-900">
                                    Video or Audio calls
                                </span>
                                .
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold">
                                4
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                                <span className="font-bold text-orange-600">
                                    Rescheduling Policy:
                                </span>{' '}
                                If you miss a session, you must allocate an
                                alternative time. If a mentee needs to
                                reschedule, they must request it at least{' '}
                                <span className="font-bold text-slate-900">
                                    6 hours before
                                </span>{' '}
                                the session or they will lose that session.
                            </p>
                        </div>
                    </div>
                </div>

                {isApproved && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-8 shadow-sm">
                        <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                            <Currency className="w-6 h-6" />
                            Finalize Your Monthly Charge
                        </h3>
                        <p className="text-blue-800 mb-6 text-sm">
                            Set your monthly subscription fee. Remember, this
                            can be increased later based on your ratings and
                            number of sessions completed.
                        </p>

                        <div className="max-w-xs relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 font-bold">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={monthlyCharge}
                                onChange={(e) =>
                                    setMonthlyCharge(Number(e.target.value))
                                }
                                min={1500}
                                max={2000}
                                className="w-full pl-10 pr-4 py-4 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-xl font-bold text-blue-900"
                            />
                        </div>
                        <p className="mt-3 text-xs text-blue-600 italic">
                            Range allowed: ₹1500 - ₹2000
                        </p>
                    </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 flex gap-4">
                    <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <p className="text-amber-800 text-sm font-medium">
                        Important: Ensure you update your achievements and extra
                        skills once onboarded. High ratings and positive reviews
                        are the primary drivers of your professional growth and
                        earning potential on Efficacy.
                    </p>
                </div>

                <div className="flex justify-center gap-4 mt-8">
                    {isApproved ? (
                        <button
                            onClick={handleActivate}
                            disabled={isActivating}
                            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center gap-2 disabled:opacity-70"
                        >
                            {isActivating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Activating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Activate & Start Mentoring
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/mentor/onboarding')}
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
                        >
                            I Understand, Proceed to Onboarding
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MentorGuidelines;
