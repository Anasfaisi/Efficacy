import { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { updateCurrentUser } from '@/redux/slices/authSlice';
import type { User } from '@/types/auth';
import {
    Camera,
    Mail,
    User as UserIcon,
    Zap,
    Trophy,
    Flame,
    Calendar,
    Lock,
    Loader2,
    ShieldCheck,
    AtSign,
    Star,
    Wallet,
    ChevronRight,
    Home,
    CreditCard,
    Settings,
    X,
} from 'lucide-react';
import { walletApi } from '@/Services/wallet.api';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { bankDetailsSchema, userProfileUpdateSchema } from '@/types/zodSchemas';
import { ZodError } from 'zod';
import { updateProfile, updateProfilePicture } from '@/Services/user.api';
import Sidebar from '../../home/layouts/Sidebar';

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
        className="bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm mb-8 hover:shadow-md transition-shadow"
    >
        <div className="p-6 md:p-8 space-y-6">
            <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>
            <div className="pt-2">{children}</div>
        </div>
        <div className="bg-purple-50/50 border-t border-purple-100 px-6 md:px-8 py-4 flex items-center justify-between">
            <p className="text-xs text-purple-600/70 font-medium">{footer}</p>
            <button
                onClick={onSave}
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 text-white text-sm font-bold rounded-xl hover:bg-purple-700 transition-all shadow-sm flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Update
            </button>
        </div>
    </motion.div>
);

const UserProfilePage = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    // Local states for inputs
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [headline, setHeadline] = useState('');
    const [dob, setDob] = useState('');
    const [xpPoints, setXpPoints] = useState(0);
    const [league, setLeague] = useState('');
    const [currentStreak, setCurrentStreak] = useState(0);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [activeTab, setActiveTab] = useState<
        'general' | 'billing' | 'security'
    >('general');

    const [showWalletModal, setShowWalletModal] = useState(false);
    const [walletData, setWalletData] = useState<any>(null);
    const [walletLoading, setWalletLoading] = useState(false);
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        accountHolderName: '',
    });
    const [isUpdatingBank, setIsUpdatingBank] = useState(false);

    const fetchWallet = async () => {
        setWalletLoading(true);
        try {
            const data = await walletApi.getWallet();
            setWalletData(data);
            if (data?.bankAccountDetails) {
                setBankDetails({
                    accountNumber:
                        data.bankAccountDetails.accountNumber || '',
                    bankName: data.bankAccountDetails.bankName || '',
                    ifscCode: data.bankAccountDetails.ifscCode || '',
                    accountHolderName:
                        data.bankAccountDetails.accountHolderName || '',
                });
            }
        } catch (error) {
            console.error('Failed to fetch wallet');
        } finally {
            setWalletLoading(false);
        }
    };

    useEffect(() => {
        if (showWalletModal) fetchWallet();
    }, [showWalletModal]);

    const handleUpdateBankDetails = async () => {
        setIsUpdatingBank(true);
        try {
            bankDetailsSchema.parse(bankDetails);
            await walletApi.updateBankDetails(bankDetails);
            toast.success('Bank details updated');
            fetchWallet();
        } catch (error) {
            if (error instanceof ZodError) {
                error.issues.forEach((err) => toast.error(err.message));
            } else {
                toast.error('Failed to update bank details');
            }
        } finally {
            setIsUpdatingBank(false);
        }
    };

    const profilePicRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (currentUser && currentUser.role === 'user') {
            const user = currentUser as User;
            setName(user.name || '');
            setBio(user.bio || '');
            setHeadline(user.headline || '');
            setDob(user.dob || '');
            setXpPoints(user.xpPoints || 0);
            setLeague(user.league || 'Beginner');
            setCurrentStreak(user.currentStreak || 0);
        }
    }, [currentUser]);

    const handleSavePartial = async (fields: any, sectionId: string) => {
        try {
            // Validate with Zod
            userProfileUpdateSchema.parse(fields);

            setIsLoading(sectionId);
            await updateProfile(fields, currentUser?.id);

            toast.success('Profile updated successfully');

            // Update Redux state
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
                toast.error(
                    typeof error === 'string' ? error : 'Update failed',
                );
            }
        } finally {
            setIsLoading(null);
        }
    };

    const handlePasswordSave = async () => {
        try {
            userProfileUpdateSchema.parse({ currentPassword, newPassword });

            if (!currentPassword || !newPassword) {
                toast.error('Both current and new passwords are required');
                return;
            }

            setIsLoading('security');

            await updateProfile(
                { currentPassword, newPassword } as any,
                currentUser?.id,
            );

            toast.success('Password updated successfully');
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: unknown) {
            if (error instanceof ZodError) {
                error.issues.forEach((err) => toast.error(err.message));
            } else {
                toast.error('Password update failed');
            }
        } finally {
            setIsLoading(null);
        }
    };

    const handleMediaChange = async (file: File) => {
        setIsLoading('profilePic');
        try {
            const res = await updateProfilePicture(
                file,
                'user',
                // currentUser?.id,
            );
            toast.success('Profile picture updated');

            if (res.user.profilePic) {
                dispatch(
                    updateCurrentUser({ profilePic: res.user.profilePic }),
                );
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setIsLoading(null);
        }
    };

    const user = currentUser as User;

    return (
        <div className="flex min-h-screen bg-[#FDFCFE]">
            <div className="hidden md:block w-64 bg-white shadow-xl z-20">
                <Sidebar />
            </div>

            <div className="flex-1 min-h-screen overflow-y-auto">
                {/* Breadcrumbs */}
                <div className="bg-white border-b border-purple-100 px-6 py-3 flex items-center gap-2 text-sm">
                    <Home className="w-4 h-4 text-slate-400" />
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-slate-500 font-medium cursor-pointer hover:text-purple-600 transition-colors">
                        Profile
                    </span>
                    <ChevronRight className="w-3 h-3 text-slate-300" />
                    <span className="text-purple-600 font-bold capitalize">
                        {activeTab}
                    </span>
                </div>

                {/* Header / Hero Section */}
                <div className="relative h-60 w-full bg-purple-600 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
                    </div>

                    <div className="max-w-4xl mx-auto px-6 pt-12 relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative group">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] border-4 border-white overflow-hidden bg-white shadow-2xl transition-transform group-hover:scale-[1.02]">
                                    {user?.profilePic ? (
                                        <img
                                            src={user.profilePic}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-purple-200 bg-purple-700">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    )}
                                    {isLoading === 'profilePic' && (
                                        <div className="absolute inset-0 bg-purple-900/40 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-white" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() =>
                                        profilePicRef.current?.click()
                                    }
                                    className="absolute -bottom-2 -right-2 p-3 bg-white text-purple-600 rounded-2xl shadow-xl hover:bg-purple-50 transition-all border-2 border-purple-100"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                <input
                                    type="file"
                                    ref={profilePicRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) =>
                                        e.target.files?.[0] &&
                                        handleMediaChange(e.target.files[0])
                                    }
                                />
                            </div>

                            <div className="text-center md:text-left text-white pt-4">
                                <h1 className="text-4xl font-black tracking-tight">
                                    {user?.name}
                                </h1>
                                <p className="text-purple-100 font-medium mt-1 text-lg opacity-90">
                                    {user?.headline ||
                                        'No professional headline set'}
                                </p>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                                        <ShieldCheck className="w-3.5 h-3.5" />{' '}
                                        {user?.role}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/10">
                                        <Calendar className="w-3.5 h-3.5" />{' '}
                                        Joined{' '}
                                        {user?.createdAt
                                            ? new Date(
                                                  user.createdAt,
                                              ).toLocaleDateString()
                                            : 'Recently'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-6 mt-8 pb-20">
                    {/* Stats Grid - Duolingo Inspired */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 flex flex-col items-center text-center gap-2"
                        >
                            <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                                <Flame className="w-6 h-6 fill-current" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">
                                {user?.currentStreak || 0}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Day Streak
                            </span>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 flex flex-col items-center text-center gap-2"
                        >
                            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                                <Zap className="w-6 h-6 fill-current" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">
                                {user?.xpPoints || 0}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Total XP
                            </span>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 flex flex-col items-center text-center gap-2"
                        >
                            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                                <Trophy className="w-6 h-6 fill-current" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">
                                {user?.league || 'Bronze'}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                League
                            </span>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100 flex flex-col items-center text-center gap-2"
                        >
                            <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                                <Star className="w-6 h-6 fill-current" />
                            </div>
                            <span className="text-2xl font-black text-slate-800">
                                {user?.longestStreak || 0}
                            </span>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Best Streak
                            </span>
                        </motion.div>
                    </div>

                    {/* Sub-navigation Navbar */}
                    <div className="flex items-center gap-1 border-b border-purple-100 mb-8 overflow-x-auto no-scrollbar">
                        <button
                            onClick={() => setActiveTab('general')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                                activeTab === 'general'
                                    ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                                    : 'border-transparent text-slate-500 hover:text-purple-600 hover:bg-slate-50'
                            }`}
                        >
                            General Info
                        </button>
                        <button
                            onClick={() => setActiveTab('billing')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                                activeTab === 'billing'
                                    ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                                    : 'border-transparent text-slate-500 hover:text-purple-600 hover:bg-slate-50'
                            }`}
                        >
                            Account & Billing
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap ${
                                activeTab === 'security'
                                    ? 'border-purple-600 text-purple-600 bg-purple-50/50'
                                    : 'border-transparent text-slate-500 hover:text-purple-600 hover:bg-slate-50'
                            }`}
                        >
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
                                    transition={{ duration: 0.2 }}
                                >
                                    <ConfigSection
                                        title="Personal Identity"
                                        description="Basic information about you. This helps us personalize your experience."
                                        footer="Your name and headline are visible to mentors."
                                        onSave={() =>
                                            handleSavePartial(
                                                { name, headline, bio, dob },
                                                'basic',
                                            )
                                        }
                                        isLoading={isLoading === 'basic'}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    Full Name
                                                </label>
                                                <div className="relative group">
                                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600" />
                                                    <input
                                                        type="text"
                                                        value={name}
                                                        onChange={(e) =>
                                                            setName(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
                                                        placeholder="Enter your name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    Headline
                                                </label>
                                                <div className="relative group">
                                                    <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600" />
                                                    <input
                                                        type="text"
                                                        value={headline}
                                                        onChange={(e) =>
                                                            setHeadline(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
                                                        placeholder="e.g. Software Engineer at TechCo"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    Bio / About Me
                                                </label>
                                                <textarea
                                                    value={bio}
                                                    onChange={(e) =>
                                                        setBio(e.target.value)
                                                    }
                                                    rows={3}
                                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all resize-none font-medium"
                                                    placeholder="Tell us a bit about yourself..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    Date of Birth
                                                </label>
                                                <div className="relative group">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600" />
                                                    <input
                                                        type="date"
                                                        value={dob}
                                                        onChange={(e) =>
                                                            setDob(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </ConfigSection>
                                </motion.div>
                            )}

                            {activeTab === 'billing' && (
                                <motion.div
                                    key="billing"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ConfigSection
                                        title="Account & Billing"
                                        description="Manage your account level settings and view your current balance."
                                        footer="Billing information is securely handled via Stripe."
                                        onSave={() => Promise.resolve()} // Handled elsewhere or view only
                                        isLoading={false}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    Email Address
                                                </label>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600" />
                                                    <input
                                                        type="email"
                                                        value={user?.email}
                                                        disabled
                                                        className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-500 cursor-not-allowed font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    Wallet Balance
                                                </label>
                                                <div className="relative group">
                                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600" />
                                                    <div className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-700 font-bold flex items-center justify-between">
                                                        <span>
                                                            {user?.walletCurrency ||
                                                                '₹'}{' '}
                                                            {user?.walletBalance ||
                                                                0}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                setShowWalletModal(
                                                                    true,
                                                                )
                                                            }
                                                            className="text-purple-600 text-xs hover:underline flex items-center gap-1 font-bold uppercase"
                                                        >
                                                            Manage Wallet{' '}
                                                            <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
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
                                    transition={{ duration: 0.2 }}
                                >
                                    <ConfigSection
                                        title="Security & Password"
                                        description="Keep your account secure by updating your password regularly."
                                        footer="Strong passwords use a mix of letters, numbers, and symbols."
                                        onSave={handlePasswordSave}
                                        isLoading={isLoading === 'security'}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    Current Password
                                                </label>
                                                <div className="relative group">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600" />
                                                    <input
                                                        type="password"
                                                        value={currentPassword}
                                                        onChange={(e) =>
                                                            setCurrentPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 block">
                                                    New Password
                                                </label>
                                                <div className="relative group">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-purple-600" />
                                                    <input
                                                        type="password"
                                                        value={newPassword}
                                                        onChange={(e) =>
                                                            setNewPassword(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-slate-900 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium"
                                                        placeholder="Min. 8 characters"
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

            {/* Wallet Modal */}
            {showWalletModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200 h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Wallet
                            </h3>
                            <button
                                onClick={() => setShowWalletModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {walletLoading ? (
                            <div className="flex justify-center py-12">
                                <Loader2
                                    className="animate-spin text-purple-600"
                                    size={32}
                                />
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {/* Balance Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white flex flex-col justify-center shadow-lg shadow-purple-200">
                                        <p className="text-purple-200 text-xs font-black uppercase tracking-widest mb-2 opacity-80">
                                            Available Balance
                                        </p>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-5xl font-black">
                                                ₹{walletData?.balance || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-purple-200/80 font-medium">
                                            <span>Pending Clearance:</span>
                                            <span>
                                                ₹
                                                {walletData?.pendingBalance ||
                                                    0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <CreditCard
                                                size={18}
                                                className="text-purple-600"
                                            />
                                            Bank Details
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    placeholder="Account Holder Name"
                                                    className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium transition-all"
                                                    value={
                                                        bankDetails.accountHolderName
                                                    }
                                                    onChange={(e) =>
                                                        setBankDetails({
                                                            ...bankDetails,
                                                            accountHolderName:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <input
                                                    placeholder="Account Number"
                                                    className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium transition-all"
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
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    placeholder="Bank Name"
                                                    className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium transition-all"
                                                    value={bankDetails.bankName}
                                                    onChange={(e) =>
                                                        setBankDetails({
                                                            ...bankDetails,
                                                            bankName:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <input
                                                    placeholder="IFSC Code"
                                                    className="w-full p-3 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-purple-200 outline-none text-sm font-medium uppercase transition-all"
                                                    value={bankDetails.ifscCode}
                                                    onChange={(e) =>
                                                        setBankDetails({
                                                            ...bankDetails,
                                                            ifscCode:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <button
                                                onClick={
                                                    handleUpdateBankDetails
                                                }
                                                disabled={isUpdatingBank}
                                                className="w-full mt-2 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-purple-100"
                                            >
                                                {isUpdatingBank ? (
                                                    <Loader2 className="animate-spin w-4 h-4 mx-auto" />
                                                ) : (
                                                    'Save Bank Details'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Transactions */}
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-4 text-lg">
                                        Recent Transactions
                                    </h4>
                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {walletData?.transactions?.length >
                                        0 ? (
                                            walletData.transactions.map(
                                                (tx: any) => (
                                                    <div
                                                        key={tx._id}
                                                        className="flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl border border-gray-100 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div
                                                                className={`p-3 rounded-xl ${tx.type === 'earning' || tx.type === 'refund' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}
                                                            >
                                                                <Wallet
                                                                    size={18}
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-sm text-gray-900 line-clamp-1">
                                                                    {
                                                                        tx.description
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-slate-400 font-medium">
                                                                    {new Date(
                                                                        tx.date,
                                                                    ).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p
                                                                className={`font-black text-sm ${tx.type === 'earning' || tx.type === 'refund' ? 'text-green-600' : 'text-orange-600'}`}
                                                            >
                                                                {tx.type ===
                                                                    'earning' ||
                                                                tx.type ===
                                                                    'refund'
                                                                    ? '+'
                                                                    : '-'}{' '}
                                                                ₹{tx.amount}
                                                            </p>
                                                            <span
                                                                className={`inline-block mt-1 text-[10px] uppercase px-2 py-0.5 rounded-md font-bold ${tx.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                                                            >
                                                                {tx.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        ) : (
                                            <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                                <Wallet
                                                    className="mx-auto text-gray-300 mb-2"
                                                    size={32}
                                                />
                                                <p className="text-gray-400 font-medium text-sm">
                                                    No transactions yet
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfilePage;
