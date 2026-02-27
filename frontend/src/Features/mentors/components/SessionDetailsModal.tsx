import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Star, MessageSquare, Calendar, User, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { reviewApi, type Review } from '@/Services/review.api';
import {type Booking } from '@/types/booking';

interface SessionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: Booking;
    menteeName: string;
    mentorId: string;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
    isOpen,
    onClose,
    booking,
    menteeName,
    mentorId,
}) => {
    const [review, setReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReview = async () => {
            if (!isOpen || !mentorId || !booking) return;
            setLoading(true);
            try {
                const reviews = await reviewApi.getMentorReviews(mentorId);
                const foundReview = reviews.find((r) => r.bookingId === booking.id || r.bookingId?._id === booking.id || r.bookingId?.id === booking.id);
                if (foundReview) {
                    setReview(foundReview);
                } else {
                    setReview(null);
                }
            } catch (error) {
                console.error("Failed to fetch reviews", error);
            } finally {
                setLoading(false);
            }
        };
        fetchReview();
    }, [isOpen, mentorId, booking]);

    if (!isOpen) return null;

    // We can assume duration is diff between actualEndTime and actualStartTime, but here it's already recorded in sessionMinutes or diff of booking slots if not available.
    // The previous implementation mapped "sessionMinutes" to booking.sessionMinutes. We need to check if booking has sessionMinutes, otherwise fallback to "N/A".
    const sessionMinutes = (booking as any).sessionMinutes;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-indigo-600 p-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <span className="bg-white/20 p-2 rounded-lg"><Calendar className="w-5 h-5 text-indigo-50" /></span>
                            Session Details
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-indigo-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-2 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        {/* Session Basic Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                                <div className="mt-1 bg-white p-2 text-indigo-500 rounded-xl shadow-sm">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Student</p>
                                    <p className="font-bold text-gray-900">{menteeName}</p>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-3">
                                <div className="mt-1 bg-white p-2 text-indigo-500 rounded-xl shadow-sm">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Time & Duration</p>
                                    <p className="font-bold text-gray-900">
                                        {format(new Date(booking.bookingDate), 'MMM d, yyyy')}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {booking.slot}
                                        {sessionMinutes !== undefined && (
                                            <span className="ml-2 font-semibold text-indigo-600">({sessionMinutes} mins played)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className="flex items-center justify-between px-6 py-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <div>
                                <p className="text-xs font-bold text-indigo-400 uppercase mb-1 tracking-wider">Session Status</p>
                                <p className="font-bold text-indigo-900 capitalize flex items-center gap-2">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    {booking.status}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-indigo-400 uppercase mb-1 tracking-wider">Topic</p>
                                <p className="font-bold text-indigo-900 truncate max-w-[150px]">{booking.topic || "Mentorship"}</p>
                            </div>
                        </div>

                        {/* Feedback / Review Section */}
                        <div className="pt-2">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                                <MessageSquare size={18} className="text-gray-400" />
                                Student Feedback
                            </h3>
                            
                            {loading ? (
                                <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className="text-sm font-medium">Loading feedback...</p>
                                </div>
                            ) : review ? (
                                <div className="p-6 bg-yellow-50/50 rounded-2xl border border-yellow-100">
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={18}
                                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 italic text-sm leading-relaxed">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ) : (
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-gray-500 font-medium text-sm">
                                        No review submitted for this session yet.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default SessionDetailsModal;
