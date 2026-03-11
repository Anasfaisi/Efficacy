import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import ReviewModal from './ReviewModal';
import { reviewApi } from '@/Services/review.api';
import { bookingApi } from '@/Services/booking.api';
import { BookingStatus } from '@/types/booking';
import { toast } from 'react-toastify';

interface SessionCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
    mentorName: string;
}

const SessionCompletionModal: React.FC<SessionCompletionModalProps> = ({
    isOpen,
    onClose,
    booking,
    mentorName,
}) => {
    const [step, setStep] = useState<'confirm' | 'review'>('confirm');

    const minutes = booking?.sessionMinutes || 0;
    const isCompletedByDefault =
        minutes >= 50 || booking?.status === BookingStatus.COMPLETED;

    const handleConfirmSuccess = async (isSuccess: boolean) => {
        if (isSuccess) {
            try {
                if (booking?.status !== BookingStatus.COMPLETED) {
                    await bookingApi.updateStatus({
                        bookingId: booking.id,
                        status: BookingStatus.COMPLETED,
                    });
                }
            } catch (error) {
                console.error('Failed to mark session as completed:', error);
            }
            setStep('review');
        } else {
            toast.info("Thank you for your feedback. We'll look into it.");
            onClose();
        }
    };

    const handleReviewSubmit = async (rating: number, comment: string) => {
        try {
            await reviewApi.submitReview({
                bookingId: booking.id,
                mentorId:
                    booking.mentorId?.[0]?._id ||
                    booking.mentorId?._id ||
                    booking.mentorId,
                userId: booking.userId,
                rating,
                comment,
            });
            onClose();
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to submit review'
            );
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <AnimatePresence>
                {step === 'confirm' && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-sm bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden text-center p-10"
                        >
                            <div className="mb-6 flex justify-center">
                                {isCompletedByDefault ? (
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2
                                            size={40}
                                            className="text-green-600"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
                                        <AlertTriangle
                                            size={40}
                                            className="text-amber-600"
                                        />
                                    </div>
                                )}
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                Session Ended
                            </h2>
                            <div className="flex items-center justify-center gap-2 mb-6 text-gray-500 font-bold bg-gray-50 py-2 px-4 rounded-2xl mx-auto w-fit">
                                <Clock size={16} />
                                <span>{minutes} minutes spent</span>
                            </div>

                            <p className="text-gray-600 mb-8 font-medium">
                                {isCompletedByDefault
                                    ? `It looks like your session with ${mentorName} went well! Would you like to leave a review?`
                                    : `Your session was shorter than expected. Did it complete successfully?`}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => handleConfirmSuccess(true)}
                                    className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                                >
                                    {isCompletedByDefault
                                        ? 'Yes, rate it!'
                                        : 'Yes, it was great'}
                                </button>
                                <button
                                    onClick={() => handleConfirmSuccess(false)}
                                    className="w-full py-4 bg-gray-50 text-gray-500 font-black rounded-2xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                                >
                                    {isCompletedByDefault
                                        ? 'Maybe later'
                                        : 'No, there was an issue'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <ReviewModal
                isOpen={step === 'review'}
                onClose={onClose}
                onSubmit={handleReviewSubmit}
                mentorName={mentorName}
                canSkip={true}
            />
        </>
    );
};

export default SessionCompletionModal;
