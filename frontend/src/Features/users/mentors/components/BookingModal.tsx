import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (topic: string) => Promise<void>;
    date: Date | null;
    slot: string | null;
    mentorName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    date, 
    slot, 
    mentorName 
}) => {
    const [topic, setTopic] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleConfirm = async () => {
        if (!topic.trim()) return;
        setIsSubmitting(true);
        try {
            await onConfirm(topic);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                setTopic('');
            }, 3000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !date || !slot) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
                    className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden"
                >
                    {isSuccess ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200"
                            >
                                <CheckCircle2 size={48} className="text-white" />
                            </motion.div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">Session Booked!</h2>
                            <p className="text-gray-500">Your session with {mentorName} has been scheduled successfully.</p>
                        </div>
                    ) : (
                        <>
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Confirm Booking</h2>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6 mb-8">
                                    <div className="bg-gray-50/50 rounded-3xl p-6 border border-gray-100 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                                <Calendar size={20} className="text-[#7F00FF]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</p>
                                                <p className="font-bold text-gray-900">{format(date, 'EEEE, MMMM do')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                                                <Clock size={20} className="text-[#7F00FF]" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Slot</p>
                                                <p className="font-bold text-gray-900">{slot}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                            What do you want to discuss?
                                        </label>
                                        <textarea
                                            value={topic}
                                            onChange={(e) => setTopic(e.target.value)}
                                            placeholder="e.g. System Design Mock Interview"
                                            className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]/30 focus:outline-none transition-all resize-none min-h-[120px]"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={isSubmitting || !topic.trim()}
                                        className="w-full py-4 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-black rounded-2xl shadow-xl shadow-[#7F00FF]/30 hover:shadow-[#7F00FF]/50 active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Scheduling...' : 'Confirm Schedule'}
                                    </button>
                                    <div className="flex items-start gap-2 bg-blue-50/50 p-4 rounded-2xl">
                                        <AlertCircle size={14} className="text-blue-500 mt-0.5" />
                                        <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
                                            By confirming, you agree to the 3-hour reschedule policy. Cancellation within 3 hours of the session may result in a lost session.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BookingModal;
