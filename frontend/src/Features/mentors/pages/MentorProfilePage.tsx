import { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
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
    User as UserIcon,
    ShieldCheck,
    ChevronRight,
    Home,
    Clock,
    Mail,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
    mentorProfileUpdateSchema,
    bankDetailsSchema,
} from '@/types/zodSchemas';
import { ZodError } from 'zod';
import { mentorApi } from '@/Services/mentor.api';
import { walletApi } from '@/Services/wallet.api';

interface ConfigSectionProps {
    title: string;
    description: string;
    footer?: string;
    children: React.ReactNode;
    onSave: () => Promise<void>;
    isLoading?: boolean;
}

const parseStringifiedArray = (input: any): string[] => {
    if (!input) return [];
    if (typeof input === 'string') {
        try {
            const parsed = JSON.parse(input);
            return parseStringifiedArray(parsed);
        } catch {
            return input
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean);
        }
    }
    if (Array.isArray(input)) {
        if (
            input.length > 0 &&
            typeof input[0] === 'string' &&
            input[0].startsWith('[')
        ) {
            try {
                const firstParsed = JSON.parse(input[0]);
                if (Array.isArray(firstParsed)) {
                    return parseStringifiedArray(firstParsed);
                }
            } catch {
                // fall through
            }
        }
        return input.map((item) => String(item));
    }
    return [];
};

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

const TIME_SLOTS = [
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
    '9:00 PM - 10:00 PM',
];

const MentorProfilePage = () => {
    const dispatch = useAppDispatch();
    const [fullMentor, setFullMentor] = useState<Mentor | null>(null);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<
        'general' | 'professional' | 'availability' | 'financial' | 'security'
    >('general');

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

    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [preferredTime, setPreferredTime] = useState<string[]>([]);

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

                setAvailableDays(parseStringifiedArray(data.availableDays));
                setPreferredTime(parseStringifiedArray(data.preferredTime));

                const walletData = await walletApi.getWallet();
                if (walletData?.bankAccountDetails) {
                    setBankDetails({
                        accountNumber:
                            walletData.bankAccountDetails.accountNumber || '',
                        bankName: walletData.bankAccountDetails.bankName || '',
                        ifscCode: walletData.bankAccountDetails.ifscCode || '',
                        accountHolderName:
                            walletData.bankAccountDetails.accountHolderName ||
                            '',
                    });
                }
            } catch (error) {
                console.log(error);
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
        sectionId: string
    ) => {
        try {
            mentorProfileUpdateSchema.parse(fields);

            setIsLoading(sectionId);
            await mentorApi.updateMentorProfileBasicInfo(fields);
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
                    axiosError.response?.data?.message || 'Update failed'
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
            mentorProfileUpdateSchema.parse({ currentPassword, newPassword });

            if (!currentPassword || !newPassword) {
                toast.error('Both current and new passwords are required');
                return;
            }

            setIsLoading('security');
            await mentorApi.updateMentorProfileBasicInfo({
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
                        'Password update failed'
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
            await mentorApi.updateMentorProfileArray(
                'achievements',
                achievements
            );
            toast.success('Achievements updated');
        } catch (error) {
            toast.error('Update failed');
            console.log(error);
        } finally {
            setIsLoading(null);
        }
    };

    const handleMediaChange = async (
        file: File,
        type: 'profilePic' | 'coverPic'
    ) => {
        setIsLoading(type);
        try {
            await mentorApi.updateMentorProfileMedia({
                profilePic: type === 'profilePic' ? file : null,
                coverPic: type === 'coverPic' ? file : null,
                resume: null,
                certificate: null,
                idProof: null,
            });
            toast.success(
                `${type === 'profilePic' ? 'Profile' : 'Cover'} picture updated`
            );

            const data = await mentorApi.getMentorProfile();
            setFullMentor(data);

            if (type === 'profilePic' && data.profilePic) {
                dispatch(updateCurrentUser({ profilePic: data.profilePic }));
            } else if (type === 'coverPic' && data.coverPic) {
                dispatch(updateCurrentUser({ coverPic: data.coverPic }));
            }
        } catch (error) {
            toast.error('Upload failed');
            console.log(error);
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

    const handleSaveAvailability = async () => {
        setIsLoading('availability');
        try {
            await mentorApi.updateMentorProfileBasicInfo({
                availableDays: availableDays,
                preferredTime: preferredTime,
            });
            toast.success('Availability updated successfully');
            setFullMentor((prev) =>
                prev ? { ...prev, availableDays, preferredTime } : null
            );
        } catch (error) {
            toast.error('Failed to update availability');
            console.log(error);
        } finally {
            setIsLoading(null);
        }
    };

    const toggleDay = (day: string) => {
        console.log(day, availableDays);
        setAvailableDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const addTimeSlot = (slot: string) => {
        if (!slot || preferredTime.includes(slot)) return;
        setPreferredTime((prev) => [...prev, slot]);
    };

    const removeTimeRange = (index: number) => {
        setPreferredTime((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex min-h-screen bg-[#FDFCFE]">
            {/* Breadcrumbs & Navigation structure like User side */}
            <div className="flex-1 min-h-screen overflow-y-auto pb-20">
                {/* Breadcrumbs */}
                <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-slate-400" />
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-slate-500 font-medium cursor-pointer hover:text-blue-600 transition-colors">
                        Mentor Profile
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-blue-600 font-bold capitalize">
                        {activeTab}
                    </span>
                </div>

                {/* Hero Header */}
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
                            {fullMentor?.coverPic
                                ? 'Change Cover'
                                : 'Upload Cover'}
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

                <div className="max-w-4xl mx-auto px-6 -mt-16">
                    {/* Profile Brief Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 relative z-10">
                        <div className="relative">
                            <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg">
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
                                        'profilePic'
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
                            <p className="text-slate-500 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4 text-slate-400" />
                                {fullMentor?.email}
                            </p>
                        </div>

                        <div className="pb-2">
                            <a
                                href={`/mentor/${fullMentor?.id || fullMentor?._id}`}
                                className="px-5 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2 text-sm"
                            >
                                <ExternalLink className="w-4 h-4" />
                                View Public Profile
                            </a>
                        </div>
                    </div>

                    {/* Sub-navigation Tabs */}
                    <div className="flex items-center gap-1 border-b border-slate-100 mb-8 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                                activeTab === 'general'
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                            }`}
                        >
                            <UserIcon className="w-4 h-4" />
                            General
                        </button>
                        <button
                            onClick={() => setActiveTab('professional')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                                activeTab === 'professional'
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                            }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Professional
                        </button>
                        <button
                            onClick={() => setActiveTab('availability')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                                activeTab === 'availability'
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            Availability
                        </button>
                        <button
                            onClick={() => setActiveTab('financial')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                                activeTab === 'financial'
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                            }`}
                        >
                            <IndianRupee className="w-4 h-4" />
                            Financial
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                                activeTab === 'security'
                                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                    : 'border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50'
                            }`}
                        >
                            <Lock className="w-4 h-4" />
                            Security
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence mode="wait">
                            {activeTab === 'general' && (
                                <motion.div
                                    key="general"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    <ConfigSection
                                        title="Standard Identity"
                                        description="Your basic professional identity. Real names help build credibility with students."
                                        footer="Name and Bio are the most viewed parts of your profile."
                                        onSave={() =>
                                            handleSavePartial(
                                                { name, bio },
                                                'basic'
                                            )
                                        }
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
                                                    onChange={(e) =>
                                                        setName(e.target.value)
                                                    }
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
                                                    onChange={(e) =>
                                                        setBio(e.target.value)
                                                    }
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
                                                'contact'
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
                                                    onChange={(e) =>
                                                        setPhone(e.target.value)
                                                    }
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
                                                    onChange={(e) =>
                                                        setCity(e.target.value)
                                                    }
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
                                                    onChange={(e) =>
                                                        setCountry(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                    placeholder="India"
                                                />
                                            </div>
                                        </div>
                                    </ConfigSection>

                                    <ConfigSection
                                        title="Social Links"
                                        description="Connect your digital footprint to build trust."
                                        footer="Valid social links increase your profile's 'Verified' score."
                                        onSave={() =>
                                            handleSavePartial(
                                                {
                                                    linkedin,
                                                    github,
                                                    personalWebsite: website,
                                                },
                                                'socials'
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
                                                        setLinkedin(
                                                            e.target.value
                                                        )
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
                                                    onChange={(e) =>
                                                        setGithub(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 bg-transparent border-none py-3 outline-none text-slate-900 text-sm"
                                                    placeholder="https://github.com/username"
                                                />
                                            </div>
                                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-1 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-500 transition-all">
                                                <Globe className="w-5 h-5 text-emerald-600" />
                                                <input
                                                    type="text"
                                                    value={website}
                                                    onChange={(e) =>
                                                        setWebsite(
                                                            e.target.value
                                                        )
                                                    }
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
                                                {achievements.map(
                                                    (item, index) => (
                                                        <motion.div
                                                            key={index}
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.95,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                scale: 0.95,
                                                            }}
                                                            className="flex items-center gap-3"
                                                        >
                                                            <div className="flex-1 relative group">
                                                                <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const newArr =
                                                                            [
                                                                                ...achievements,
                                                                            ];
                                                                        newArr[
                                                                            index
                                                                        ] =
                                                                            e.target.value;
                                                                        setAchievements(
                                                                            newArr
                                                                        );
                                                                    }}
                                                                    className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    setAchievements(
                                                                        achievements.filter(
                                                                            (
                                                                                _,
                                                                                i
                                                                            ) =>
                                                                                i !==
                                                                                index
                                                                        )
                                                                    )
                                                                }
                                                                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </motion.div>
                                                    )
                                                )}
                                            </AnimatePresence>
                                            <button
                                                onClick={() =>
                                                    setAchievements([
                                                        ...achievements,
                                                        '',
                                                    ])
                                                }
                                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-bold text-sm mt-2"
                                            >
                                                <Plus size={16} />
                                                Add Achievement
                                            </button>
                                        </div>
                                    </ConfigSection>
                                </motion.div>
                            )}

                            {activeTab === 'professional' && (
                                <motion.div
                                    key="professional"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
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
                                                    'academic'
                                                )
                                            }
                                            isLoading={isLoading === 'academic'}
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                                        <BookOpen size={14} />{' '}
                                                        Qualification
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={qualification}
                                                        onChange={(e) =>
                                                            setQualification(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="M.Tech in CS"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                                        <GraduationCap
                                                            size={14}
                                                        />{' '}
                                                        University
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={university}
                                                        onChange={(e) =>
                                                            setUniversity(
                                                                e.target.value
                                                            )
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
                                                            setGraduationYear(
                                                                e.target.value
                                                            )
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
                                                            setAcademicSpan(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="5"
                                                    />
                                                </div>
                                            </div>
                                        </ConfigSection>
                                    )}

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
                                                'industry'
                                            )
                                        }
                                        isLoading={isLoading === 'industry'}
                                    >
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                                        <Briefcase size={14} />{' '}
                                                        Current Role
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={currentRole}
                                                        onChange={(e) =>
                                                            setCurrentRole(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="Staff Engineer"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-1">
                                                        <Building2 size={14} />{' '}
                                                        Industry Sector
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={industryCategory}
                                                        onChange={(e) =>
                                                            setIndustryCategory(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="FinTech / EdTech"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-1 block">
                                                    Industrial Skills
                                                    (Knowledge)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={skills}
                                                    onChange={(e) =>
                                                        setSkills(
                                                            e.target.value
                                                        )
                                                    }
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
                                                        setExpertise(
                                                            e.target.value
                                                        )
                                                    }
                                                    rows={2}
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none"
                                                    placeholder="System Design Interviews, Architecture Reviews, Career Strategy"
                                                />
                                                <p className="text-[10px] text-slate-400 ml-1 mt-1 italic">
                                                    Mention specific areas where
                                                    you can provide strong
                                                    mentorship.
                                                </p>
                                            </div>
                                        </div>
                                    </ConfigSection>
                                </motion.div>
                            )}

                            {activeTab === 'availability' && (
                                <motion.div
                                    key="availability"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    <ConfigSection
                                        title="Weekly Availability"
                                        description="Select the days you are available for mentoring sessions."
                                        footer="Students can only book sessions on your selected days."
                                        onSave={handleSaveAvailability}
                                        isLoading={isLoading === 'availability'}
                                    >
                                        <div className="flex flex-wrap gap-3">
                                            {[
                                                'Monday',
                                                'Tuesday',
                                                'Wednesday',
                                                'Thursday',
                                                'Friday',
                                                'Saturday',
                                                'Sunday',
                                            ].map((day) => (
                                                <button
                                                    key={day}
                                                    onClick={() =>
                                                        toggleDay(day)
                                                    }
                                                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                                                        availableDays.includes(
                                                            day
                                                        )
                                                            ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-100'
                                                            : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-500'
                                                    }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </ConfigSection>

                                    <ConfigSection
                                        title="Preferred Time Slots"
                                        description="Define your available time ranges (e.g., 9:00 AM - 12:00 PM). These will be split into 1-hour slots."
                                        footer="Use format: 9:00 AM - 5:00 PM"
                                        onSave={handleSaveAvailability}
                                        isLoading={isLoading === 'availability'}
                                    >
                                        <div className="space-y-4">
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <Select
                                                        onValueChange={(slot) =>
                                                            addTimeSlot(slot)
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all h-[45px]">
                                                            <div className="flex items-center gap-3">
                                                                <Clock className="w-4 h-4 text-slate-400" />
                                                                <SelectValue placeholder="Select a 1-hour slot" />
                                                            </div>
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_SLOTS.map(
                                                                (slot) => (
                                                                    <SelectItem
                                                                        key={
                                                                            slot
                                                                        }
                                                                        value={
                                                                            slot
                                                                        }
                                                                        disabled={preferredTime.includes(
                                                                            slot
                                                                        )}
                                                                    >
                                                                        {slot}
                                                                    </SelectItem>
                                                                )
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <AnimatePresence mode="popLayout">
                                                    {preferredTime.map(
                                                        (range, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{
                                                                    opacity: 0,
                                                                    scale: 0.95,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    scale: 1,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    scale: 0.95,
                                                                }}
                                                                className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl"
                                                            >
                                                                <span className="text-sm font-bold text-slate-700">
                                                                    {range}
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        removeTimeRange(
                                                                            index
                                                                        )
                                                                    }
                                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </motion.div>
                                                        )
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </ConfigSection>
                                </motion.div>
                            )}

                            {activeTab === 'financial' && (
                                <motion.div
                                    key="financial"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    <ConfigSection
                                        title="Monetization"
                                        description="Set your monthly mentoring fee for students."
                                        footer="Value your time based on your experience level."
                                        onSave={() =>
                                            handleSavePartial(
                                                {
                                                    monthlyCharge:
                                                        Number(monthlyCharge),
                                                },
                                                'money'
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
                                                    setMonthlyCharge(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                                placeholder="1500"
                                            />
                                        </div>
                                    </ConfigSection>

                                    <ConfigSection
                                        title="Bank Details"
                                        description="Withdraw your earnings to your bank account."
                                        footer="Payments are processed securely via our financial partners."
                                        onSave={handleSaveBankDetails}
                                        isLoading={isLoading === 'bank'}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                                    Account Holder Name
                                                </label>
                                                <div className="relative group">
                                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                                    <input
                                                        type="text"
                                                        value={
                                                            bankDetails.accountHolderName
                                                        }
                                                        onChange={(e) =>
                                                            setBankDetails({
                                                                ...bankDetails,
                                                                accountHolderName:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                                    Bank Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bankDetails.bankName}
                                                    onChange={(e) =>
                                                        setBankDetails({
                                                            ...bankDetails,
                                                            bankName:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                                    Account Number
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        bankDetails.accountNumber
                                                    }
                                                    onChange={(e) =>
                                                        setBankDetails({
                                                            ...bankDetails,
                                                            accountNumber:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                                    IFSC Code
                                                </label>
                                                <input
                                                    type="text"
                                                    value={bankDetails.ifscCode}
                                                    onChange={(e) =>
                                                        setBankDetails({
                                                            ...bankDetails,
                                                            ifscCode:
                                                                e.target.value,
                                                        })
                                                    }
                                                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </ConfigSection>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    <ConfigSection
                                        title="Account Security"
                                        description="Update your password to keep your account secure."
                                        footer="Never share your password with anyone."
                                        onSave={handlePasswordSave}
                                        isLoading={isLoading === 'security'}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                                    Current Password
                                                </label>
                                                <div className="relative group">
                                                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                                    <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) =>
                                                            setCurrentPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
                                                    New Password
                                                </label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) =>
                                                            setNewPassword(
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                                        placeholder="Min 8 characters"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </ConfigSection>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorProfilePage;
