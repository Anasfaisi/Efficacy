import { useState, useRef, useEffect } from 'react';
import {  useAppDispatch } from '@/redux/hooks';
import { updateCurrentUser } from '@/redux/slices/authSlice';
import type { Mentor } from '@/types/auth';
import {
    Camera,
    Globe,
    Linkedin,
    Github,
    BookOpen,
    Briefcase,
    CheckCircle2,
    Loader2,
    Trash2,
    Plus,
    ExternalLink,
    Target,
    GraduationCap,
    Building2,
    Lock,
    IndianRupee,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { mentorProfileUpdateSchema } from '@/types/zodSchemas';
import { ZodError } from 'zod';
import {
    mentorApi,
    updateMentorProfileBasicInfo,
    updateMentorProfileMedia,
    updateMentorProfileArray,
} from '@/Services/mentor.api';
import { walletApi } from '@/Services/wallet.api';
import { bankDetailsSchema } from '@/types/zodSchemas';

interface ConfigSectionProps {
    title: string;
    description: string;
    footer?: string;
    children: React.ReactNode;
    onSave: () => Promise<void>;
    isLoading?: boolean;
}

const ConfigSection = ({
    title,
    description,
    footer,
    children,
    onSave,
    isLoading,
}: ConfigSectionProps) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm mb-8"
    >
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>
            <div className="pt-2">{children}</div>
        </div>
        <div className="bg-slate-50 border-t border-slate-200 px-6 md:px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">{footer}</p>
            <button
                onClick={onSave}
                disabled={isLoading}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
            </button>
        </div>
    </motion.div>
);

const MentorProfilePage = () => {
    // const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [fullMentor, setFullMentor] = useState<Mentor | null>(null);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);

    // Local states for inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');

    const [linkedin, setLinkedin] = useState('');
    const [github, setGithub] = useState('');
    const [website, setWebsite] = useState('');

    const [currentRole, setCurrentRole] = useState('');
    const [industryCategory, setIndustryCategory] = useState('');

    const [qualification, setQualification] = useState('');
    const [university, setUniversity] = useState('');
    const [graduationYear, setGraduationYear] = useState('');
    const [academicSpan, setAcademicSpan] = useState('');

    const [skills, setSkills] = useState('');
    const [expertise, setExpertise] = useState('');
    const [monthlyCharge, setMonthlyCharge] = useState<number | string>('');
    const [achievements, setAchievements] = useState<string[]>([]);
    
    // Bank Details State
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        accountHolderName: '',
    });

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const profilePicRef = useRef<HTMLInputElement>(null);
    const coverPicRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await mentorApi.getMentorProfile();
                setFullMentor(data);
                // Sync local states
                setName(data.name || '');
                setEmail(data.email || '');
                setBio(data.bio || '');
                setPhone(data.phone || '');
                setCity(data.city || '');
                setCountry(data.country || '');

                setLinkedin(data.linkedin || '');
                setGithub(data.github || '');
                setWebsite(data.personalWebsite || '');

                setCurrentRole(data.currentRole || '');
                setIndustryCategory(data.industryCategory || '');

                setQualification(data.qualification || '');
                setUniversity(data.university || '');
                setGraduationYear(data.graduationYear || '');
                setAcademicSpan(data.academicSpan || '');

                setSkills(data.skills || '');
                setExpertise(data.expertise || '');
                setMonthlyCharge(data.monthlyCharge || '');
                setAchievements(data.achievements || []);

                // Fetch Bank Details
                const walletData = await walletApi.getWallet();
                if (walletData?.bankAccountDetails) {
                    setBankDetails({
                        accountNumber: walletData.bankAccountDetails.accountNumber || '',
                        bankName: walletData.bankAccountDetails.bankName || '',
                        ifscCode: walletData.bankAccountDetails.ifscCode || '',
                        accountHolderName: walletData.bankAccountDetails.accountHolderName || '',
                    });
                }
            } catch (error) {
                toast.error('Failed to fetch profile details');
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (isPageLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    const handleSavePartial = async (
        fields: Partial<Mentor>,
        sectionId: string,
    ) => {
        try {
            // Validate with Zod
            mentorProfileUpdateSchema.parse(fields);

            setIsLoading(sectionId);
            await updateMentorProfileBasicInfo(fields);
            toast.success('Section updated successfully');
            setFullMentor((prev) => (prev ? { ...prev, ...fields } : null));
            dispatch(updateCurrentUser(fields));
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                error.issues.forEach((err) => toast.error(err.message));
            } else if (
                error &&
                typeof error === 'object' &&
                'response' in error
            ) {
                const axiosError = error as {
                    response?: { data?: { message?: string } };
                };
                toast.error(
                    axiosError.response?.data?.message || 'Update failed',
                );
            } else {
                toast.error('Update failed');
            }
        } finally {
            setIsLoading(null);
        }
    };

    const handlePasswordSave = async () => {
        try {
            // Validate with Zod
            mentorProfileUpdateSchema.parse({ currentPassword, newPassword });

            if (!currentPassword || !newPassword) {
                toast.error('Both current and new passwords are required');
                return;
            }

            setIsLoading('security');
            await updateMentorProfileBasicInfo({
                currentPassword,
                newPassword,
            } as any);
            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                error.issues.forEach((err) => toast.error(err.message));
            } else if (
                error &&
                typeof error === 'object' &&
                'response' in error
            ) {
                const axiosError = error as {
                    response?: { data?: { message?: string } };
                };
                toast.error(
                    axiosError.response?.data?.message ||
                        'Password update failed',
                );
            } else {
                toast.error('Password update failed');
            }
        } finally {
            setIsLoading(null);
        }
    };

    const handleSaveAchievements = async () => {
        setIsLoading('achievements');
        try {
            await updateMentorProfileArray('achievements', achievements);
            toast.success('Achievements updated');
        } catch (error) {
            toast.error('Update failed');
        } finally {
            setIsLoading(null);
        }
    };

    const handleMediaChange = async (
        file: File,
        type: 'profilePic' | 'coverPic',
    ) => {
        setIsLoading(type);
        try {
            await updateMentorProfileMedia({
                profilePic: type === 'profilePic' ? file : null,
                coverPic: type === 'coverPic' ? file : null,
                resume: null,
                certificate: null,
                idProof: null,
            });
            toast.success(
                `${type === 'profilePic' ? 'Profile' : 'Cover'} picture updated`,
            );

            // Update local state
            const data = await mentorApi.getMentorProfile();
            setFullMentor(data);

            // Update Redux state
            if (type === 'profilePic' && data.profilePic) {
                dispatch(updateCurrentUser({ profilePic: data.profilePic }));
            } else if (type === 'coverPic' && data.coverPic) {
                dispatch(updateCurrentUser({ coverPic: data.coverPic } as any));
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setIsLoading(null);
        }
    };

    const handleSaveBankDetails = async () => {
        setIsLoading('bank');
        try {
            bankDetailsSchema.parse(bankDetails);
            await walletApi.updateBankDetails(bankDetails);
            toast.success('Bank details updated successfully');
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                error.issues.forEach((err) => toast.error(err.message));
            } else {
                toast.error('Failed to update bank details');
            }
        } finally {
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Cover Header */}
            <div className="relative h-64 w-full bg-slate-200 overflow-hidden group">
                {fullMentor?.coverPic ? (
                    <img
                        src={fullMentor.coverPic}
                        className="w-full h-full object-cover"
                        alt="Cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700" />
                )}

                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                        onClick={() => coverPicRef.current?.click()}
                        className="bg-white/90 hover:bg-white text-slate-900 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-xl border border-white/50"
                    >
                        <Camera size={18} />
                        {fullMentor?.coverPic ? 'Change Cover' : 'Upload Cover'}
                    </button>
                </div>

                <input
                    type="file"
                    ref={coverPicRef}
                    className="hidden"
                    onChange={(e) =>
                        e.target.files?.[0] &&
                        handleMediaChange(e.target.files[0], 'coverPic')
                    }
                />
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-16">
                {/* Profile Brief Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 relative z-10">
                    <div className="relative">
                        <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-slate-100 shadow-lg">
                            {fullMentor?.profilePic ? (
                                <img
                                    src={fullMentor.profilePic}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-300">
                                    {name.charAt(0)}
                                </div>
                            )}
                            {isLoading === 'profilePic' && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => profilePicRef.current?.click()}
                            className="absolute bottom-1 right-1 p-2.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all border-2 border-white"
                        >
                            <Camera className="w-4 h-4" />
                        </button>
                        <input
                            type="file"
                            ref={profilePicRef}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) =>
                                e.target.files?.[0] &&
                                handleMediaChange(
                                    e.target.files[0],
                                    'profilePic',
                                )
                            }
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left pb-2">
                        <h1 className="text-3xl font-bold text-slate-900">
                            {name}
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                            Verified {fullMentor?.mentorType} Mentor
                        </p>
                    </div>

                    <div className="pb-2">
                        <a
                            href={`/mentor/${fullMentor?.id}`}
                            className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 text-sm"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View Public Profile
                        </a>
                    </div>
                </div>

                <div className="space-y-4">
                    <ConfigSection
                        title="Standard Identity"
                        description="Your basic professional identity. Real names help build credibility with students."
                        footer="Name and Bio are the most viewed parts of your profile."
                        onSave={() => handleSavePartial({ name, bio }, 'basic')}
                        isLoading={isLoading === 'basic'}
                    >
                        <div className="space-y-6">
                            <div className="max-w-md">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Anas C BCR 64"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">
                                    Professional Bio
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Share your transition from industry to mentoring..."
                                />
                            </div>
                        </div>
                    </ConfigSection>

                    <ConfigSection
                        title="Location & Contact"
                        description="Help students understand your time zone and reachability."
                        footer="Your email remains private and is only used for account security."
                        onSave={() =>
                            handleSavePartial(
                                { phone, city, country },
                                'contact',
                            )
                        }
                        isLoading={isLoading === 'contact'}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                    Email (Immutable)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-400 cursor-not-allowed font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Bangalore"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                    Country
                                </label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="India"
                                />
                            </div>
                        </div>
                    </ConfigSection>

                    {/* Academic Profile - Only if Academic */}
                    {fullMentor?.mentorType === 'Academic' && (
                        <ConfigSection
                            title="Academic Credentials"
                            description="Your educational background and academic reach."
                            footer="Verified credentials build student trust."
                            onSave={() =>
                                handleSavePartial(
                                    {
                                        qualification,
                                        university,
                                        graduationYear,
                                        academicSpan,
                                    },
                                    'academic',
                                )
                            }
                            isLoading={isLoading === 'academic'}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                        <BookOpen size={14} /> Qualification
                                    </label>
                                    <input
                                        type="text"
                                        value={qualification}
                                        onChange={(e) =>
                                            setQualification(e.target.value)
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="M.Tech in CS"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                        <GraduationCap size={14} /> University
                                    </label>
                                    <input
                                        type="text"
                                        value={university}
                                        onChange={(e) =>
                                            setUniversity(e.target.value)
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="IIT Bombay"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                        Graduation Year
                                    </label>
                                    <input
                                        type="text"
                                        value={graduationYear}
                                        onChange={(e) =>
                                            setGraduationYear(e.target.value)
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="2018"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                        Academic Span (Years)
                                    </label>
                                    <input
                                        type="text"
                                        value={academicSpan}
                                        onChange={(e) =>
                                            setAcademicSpan(e.target.value)
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="5"
                                    />
                                </div>
                            </div>
                        </ConfigSection>
                    )}

                    {/* Industry Profile - Role and Expertise */}
                    <ConfigSection
                        title="Industry & Expertise"
                        description="Define your professional sphere and specific guidance areas."
                        footer="'Skills' covers tools; 'Expertise' covers complex guidance topics."
                        onSave={() =>
                            handleSavePartial(
                                {
                                    currentRole,
                                    industryCategory,
                                    skills,
                                    expertise,
                                },
                                'industry',
                            )
                        }
                        isLoading={isLoading === 'industry'}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                        <Briefcase size={14} /> Current Role
                                    </label>
                                    <input
                                        type="text"
                                        value={currentRole}
                                        onChange={(e) =>
                                            setCurrentRole(e.target.value)
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Staff Engineer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                        <Building2 size={14} /> Industry Sector
                                    </label>
                                    <input
                                        type="text"
                                        value={industryCategory}
                                        onChange={(e) =>
                                            setIndustryCategory(e.target.value)
                                        }
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="FinTech / EdTech"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">
                                    Industrial Skills (Knowledge)
                                </label>
                                <input
                                    type="text"
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Distributed Systems, Cloud Native, TDD"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">
                                    Guidance Topics (Expertise)
                                </label>
                                <textarea
                                    value={expertise}
                                    onChange={(e) =>
                                        setExpertise(e.target.value)
                                    }
                                    rows={2}
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="System Design Interviews, Architecture Reviews, Career Strategy"
                                />
                                <p className="text-[10px] text-slate-400 ml-1 mt-1 italic">
                                    Mention specific areas where you can provide
                                    strong mentorship.
                                </p>
                            </div>
                        </div>
                    </ConfigSection>

                    <ConfigSection
                        title="Monetization"
                        description="Set your monthly mentoring fee for students."
                        footer="Value your time based on your experience level."
                        onSave={() =>
                            handleSavePartial(
                                { monthlyCharge: Number(monthlyCharge) },
                                'money',
                            )
                        }
                        isLoading={isLoading === 'money'}
                    >
                        <div className="max-w-xs relative group">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                            <input
                                type="number"
                                value={monthlyCharge}
                                onChange={(e) =>
                                    setMonthlyCharge(e.target.value)
                                }
                                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                placeholder="1500"
                            />
                        </div>
                    </ConfigSection>

                    <ConfigSection
                        title="Social Links"
                        description="Connect your digital footprint to build trust."
                        footer="Valid social links increase your profile's 'Verified' score."
                        onSave={() =>
                            handleSavePartial(
                                { linkedin, github, personalWebsite: website },
                                'socials',
                            )
                        }
                        isLoading={isLoading === 'socials'}
                    >
                        <div className="space-y-4 max-w-lg">
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
                                <Linkedin className="w-5 h-5 text-blue-600" />
                                <input
                                    type="text"
                                    value={linkedin}
                                    onChange={(e) =>
                                        setLinkedin(e.target.value)
                                    }
                                    className="flex-1 bg-transparent border-none py-3 outline-none text-slate-900 text-sm"
                                    placeholder="https://linkedin.com/in/username"
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
                                <Github className="w-5 h-5 text-slate-700" />
                                <input
                                    type="text"
                                    value={github}
                                    onChange={(e) => setGithub(e.target.value)}
                                    className="flex-1 bg-transparent border-none py-3 outline-none text-slate-900 text-sm"
                                    placeholder="https://github.com/username"
                                />
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
                                <Globe className="w-5 h-5 text-emerald-600" />
                                <input
                                    type="text"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                    className="flex-1 bg-transparent border-none py-3 outline-none text-slate-900 text-sm"
                                    placeholder="https://portfolio.com"
                                />
                            </div>
                        </div>
                    </ConfigSection>

                    <ConfigSection
                        title="Achievements"
                        description="Awards and recognitions that validate your professional journey."
                        footer="Add multiple milestones to showcase your expertise."
                        onSave={handleSaveAchievements}
                        isLoading={isLoading === 'achievements'}
                    >
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {achievements.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex-1 relative group">
                                            <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                            <input
                                                type="text"
                                                value={item}
                                                onChange={(e) => {
                                                    const newArr = [
                                                        ...achievements,
                                                    ];
                                                    newArr[index] =
                                                        e.target.value;
                                                    setAchievements(newArr);
                                                }}
                                                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <button
                                            onClick={() =>
                                                setAchievements(
                                                    achievements.filter(
                                                        (_, i) => i !== index,
                                                    ),
                                                )
                                            }
                                            className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <button
                                onClick={() =>
                                    setAchievements([...achievements, ''])
                                }
                                className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-semibold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Milestone
                            </button>
                        </div>
                    </ConfigSection>

                    <ConfigSection
                        title="Bank Accounts"
                        description="Your payouts will be sent to this account."
                        footer="Ensure details match your bank records exactly."
                        onSave={handleSaveBankDetails}
                        isLoading={isLoading === 'bank'}
                    >
                         <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Account Holder Name
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    value={bankDetails.accountHolderName}
                                    onChange={(e) =>
                                        setBankDetails({
                                            ...bankDetails,
                                            accountHolderName: e.target.value,
                                        })
                                    }
                                    placeholder="Name as per bank records"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                    Account Number
                                </label>
                                <input
                                    type="text"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    value={bankDetails.accountNumber}
                                    onChange={(e) =>
                                        setBankDetails({
                                            ...bankDetails,
                                            accountNumber: e.target.value,
                                        })
                                    }
                                    placeholder="000000000000"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        Bank Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        value={bankDetails.bankName}
                                        onChange={(e) =>
                                            setBankDetails({
                                                ...bankDetails,
                                                bankName: e.target.value,
                                            })
                                        }
                                        placeholder="State Bank of India"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                        IFSC Code
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all uppercase"
                                        value={bankDetails.ifscCode}
                                        onChange={(e) =>
                                            setBankDetails({
                                                ...bankDetails,
                                                ifscCode: e.target.value,
                                            })
                                        }
                                        placeholder="SBIN0001234"
                                    />
                                </div>
                            </div>
                        </div>
                    </ConfigSection>

                    <ConfigSection
                        title="Security & Auth"
                        description="Manage your account security and authentication."
                        footer="Use a strong password to protect your account."
                        onSave={handlePasswordSave}
                        isLoading={isLoading === 'security'}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <Lock size={14} /> Current Password
                                </label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                        setCurrentPassword(e.target.value)
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                    <Lock size={14} /> New Password
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) =>
                                        setNewPassword(e.target.value)
                                    }
                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                        </div>
                    </ConfigSection>
                </div>
            </div>
        </div>
    );
};

export default MentorProfilePage;
