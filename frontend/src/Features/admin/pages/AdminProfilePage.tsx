import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import type { User } from '@/types/auth'; // or generic currentUser type
import {
    ShieldCheck,
    Mail,
    Lock,
    Loader2,
    ChevronRight,
    Home,
    UserCircle,
    Server,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfigSection = ({
    title,
    description,
    footer,
    children,
    onSave,
    isLoading,
}: {
    title: string;
    description: string;
    footer?: string;
    children: React.ReactNode;
    onSave?: () => Promise<void>;
    isLoading?: boolean;
}) => (
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
        {onSave && (
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
        )}
    </motion.div>
);

const AdminProfilePage = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState<'general' | 'security'>(
        'general'
    );

    const admin = currentUser as User;

    return (
        <div className="flex-1 min-h-screen overflow-y-auto pb-20 bg-[#FDFCFE]">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-2 text-sm">
                <Home className="w-4 h-4 text-slate-400" />
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-slate-500 font-medium cursor-pointer hover:text-blue-600 transition-colors">
                    Admin Profile
                </span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-blue-600 font-bold capitalize">
                    {activeTab}
                </span>
            </div>

            {/* Hero Header */}
            <div className="relative h-64 w-full bg-slate-200 overflow-hidden group">
                <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-900" />
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-16">
                {/* Profile Brief Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-end gap-6 mb-12 relative z-10">
                    <div className="relative">
                        <div className="w-36 h-36 rounded-2xl border-4 border-white overflow-hidden bg-sky-100 shadow-lg flex items-center justify-center">
                            <span className="text-5xl font-black text-blue-900">
                                AD
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left pb-2">
                        <h1 className="text-3xl font-bold text-slate-900">
                            Super Admin
                        </h1>
                        <p className="text-slate-500 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            System Administrator
                        </p>
                        <p className="text-slate-500 font-medium mt-1 flex items-center justify-center md:justify-start gap-2">
                            <Mail className="w-4 h-4 text-slate-400" />
                            {admin?.email || 'admin@efficacy.com'}
                        </p>
                    </div>

                    <div className="pb-2">
                        <div className="px-5 py-2.5 border border-blue-200 bg-blue-50 text-blue-800 font-semibold rounded-lg flex items-center gap-2 text-sm">
                            <Server className="w-5 h-5 text-blue-600" />
                            System Access: Full
                        </div>
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
                        <UserCircle className="w-4 h-4" />
                        Identity
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
                                    title="Administrator Identity"
                                    description="Your system administration identity."
                                >
                                    <div className="space-y-6">
                                        <div className="max-w-md">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">
                                                Role
                                            </label>
                                            <input
                                                type="text"
                                                disabled
                                                value="Super Admin"
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed font-medium"
                                            />
                                        </div>
                                        <div className="max-w-md">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-2 block">
                                                Administrative Email
                                            </label>
                                            <input
                                                type="email"
                                                disabled
                                                value={
                                                    admin?.email ||
                                                    'admin@efficacy.com'
                                                }
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed font-medium"
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
                                    title="Security Settings"
                                    description="For full system security updates, please refer to the backend environment variables or contact infrastructure support."
                                >
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3 text-amber-800">
                                        <ShieldCheck className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                                        <p className="text-sm font-medium">
                                            Administrative passwords and core
                                            permissions are managed directly via
                                            environment variables and direct DB
                                            access to ensure maximum platform
                                            security.
                                        </p>
                                    </div>
                                </ConfigSection>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;
