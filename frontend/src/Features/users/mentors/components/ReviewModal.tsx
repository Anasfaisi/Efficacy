import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => Promise<void>;
    mentorName: string;
    canSkip?: boolean;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    mentorName,
    canSkip = true,
}) => {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0 || !comment.trim()) return;
        setIsSubmitting(true);
        try {
            await onSubmit(rating, comment);
            setIsSuccess(true);
            setTimeout(() => {
                setIsSuccess(false);
                onClose();
                // Reset state
                setRating(0);
                setComment('');
            }, 2500);
        } catch (error) {
            console.error('Failed to submit review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={canSkip ? onClose : undefined}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 overflow-hidden"
                >
                    {isSuccess ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', damping: 12 }}
                                className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200"
                            >
                                <CheckCircle2
                                    size={48}
                                    className="text-white"
                                />
                            </motion.div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">
                                Thank You!
                            </h2>
                            <p className="text-gray-500">
                                Your feedback helps {mentorName} and the
                                community grow.
                            </p>
                        </div>
                    ) : (
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                                        Rate your session
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        How was your time with {mentorName}?
                                    </p>
                                </div>
                                {canSkip && (
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="flex justify-center gap-2 mb-8">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <motion.button
                                        key={star}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onMouseEnter={() =>
                                            setHoveredRating(star)
                                        }
                                        onMouseLeave={() => setHoveredRating(0)}
                                        onClick={() => setRating(star)}
                                        className="p-1"
                                    >
                                        <Star
                                            size={40}
                                            className={`transition-all duration-200 ${
                                                star <=
                                                (hoveredRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                                                    : 'text-gray-200 fill-transparent'
                                            }`}
                                        />
                                    </motion.button>
                                ))}
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-1">
                                        <MessageSquare size={12} />
                                        Share your thoughts
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) =>
                                            setComment(e.target.value)
                                        }
                                        placeholder="What did you learn? What did you like?"
                                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-100 rounded-3xl focus:ring-2 focus:ring-[#7F00FF]/20 focus:border-[#7F00FF]/30 focus:outline-none transition-all resize-none min-h-[120px] text-gray-700 font-medium"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSubmit}
                                    disabled={
                                        isSubmitting ||
                                        rating === 0 ||
                                        !comment.trim()
                                    }
                                    className="w-full py-4 bg-gradient-to-r from-[#7F00FF] to-[#E100FF] text-white font-black rounded-2xl shadow-xl shadow-[#7F00FF]/30 hover:shadow-[#7F00FF]/50 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        'Submitting...'
                                    ) : (
                                        <>
                                            Submit Review
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                                {canSkip && (
                                    <button
                                        onClick={onClose}
                                        className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
                                    >
                                        Do it later
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewModal;
