import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RescheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    bookingDetails: {
        date: string;
        slot: string;
    } | null;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    bookingDetails,
}) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Reschedule confirmation failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !bookingDetails) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <RefreshCw size={20} className="text-[#7F00FF]" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Request Reschedule</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 mb-8">
                            <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 italic text-gray-600 text-sm">
                                "Are you sure you want to request a reschedule for your session on <span className="font-bold text-gray-900">{bookingDetails.date}</span> at <span className="font-bold text-gray-900">{bookingDetails.slot}</span>?"
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3 bg-[#7F00FF]/5 p-4 rounded-2xl border border-[#7F00FF]/10">
                                    <Info size={18} className="text-[#7F00FF] mt-0.5" />
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        Once requested, the mentor will be notified. They will propose a new date and time for your approval.
                                    </p>
                                </div>

                                <div className="flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                                    <AlertCircle size={18} className="text-amber-500 mt-0.5" />
                                    <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                        Please note: The session status will only be updated to <span className="font-bold underline">Scheduled</span> or <span className="font-bold underline">Cancelled</span> after the mentor's approval of the new time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-black rounded-2xl shadow-xl shadow-[#7F00FF]/30 hover:shadow-[#7F00FF]/50 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <RefreshCw size={18} className="animate-spin" />
                                        Sending Request...
                                    </>
                                ) : (
                                    'Confirm Reschedule Request'
                                )}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-4 text-gray-500 font-bold hover:text-gray-700 transition-colors"
                            >
                                Not now
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const Info = ({ size, className }: { size: number; className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

export default RescheduleModal;
