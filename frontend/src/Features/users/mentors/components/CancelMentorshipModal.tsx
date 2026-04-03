import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle } from 'lucide-react';

interface CancelMentorshipModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    isLoading?: boolean;
    startDate?: string | Date;
}

const CancelMentorshipModal: React.FC<CancelMentorshipModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = 'Cancel Mentorship',
    message = 'Are you sure you want to cancel this mentorship? Refund policies apply.',
    isLoading = false,
    startDate,
}) => {
    if (!isOpen) return null;

    let policyNote = null;
    if (startDate) {
        const start = new Date(startDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - start.getTime());
        const daysPassed = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const daysLeft = 7 - daysPassed;

        if (daysPassed <= 7) {
            policyNote = `${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left need time to think? Our policy allows cancellation within the first 7 days for a full refund.`;
        } else {
            policyNote = `Note: The 7-day refund period has passed (${daysPassed} days since start).`;
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={!isLoading ? onClose : undefined}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-red-100/50 rounded-2xl">
                                    <AlertTriangle
                                        className="text-red-500"
                                        size={24}
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                                        {title}
                                    </h2>
                                </div>
                            </div>
                            {!isLoading && (
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="mb-8 pl-1">
                            <p className="text-gray-600 font-medium mb-3">
                                {message}
                            </p>
                            {policyNote && (
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                    <p className="text-sm text-blue-700 font-medium">{policyNote}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Keep Mentorship
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex-1 py-3 px-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CancelMentorshipModal;
