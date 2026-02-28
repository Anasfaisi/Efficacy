import React, { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    ExternalLink,
    XCircle,
    CheckCircle2,
    Clock4,
    AlertCircle,
    CalendarDays,
    ArrowUpDown,
    Star,
} from 'lucide-react';
import ReviewModal from '../components/ReviewModal';
import { reviewApi } from '@/Services/review.api';
import { toast } from 'sonner';
import { bookingApi } from '@/Services/booking.api';
import type { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import Breadcrumbs from '@/Components/common/Breadcrumbs';
import { requestWrapper } from '@/utils/apiHandler';
import type { Mentor } from '@/types/auth';

const BookingHistoryPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null
    );
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await requestWrapper(
                bookingApi.getUserBookings(
                    currentPage,
                    limit,
                    statusFilter === 'all' ? undefined : statusFilter,
                    startDate || undefined,
                    endDate || undefined
                )
            );

            if (response) {
                setBookings(response.bookings);
                setTotalCount(response.totalCount);
                setTotalPages(response.totalPages);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load booking history');
        } finally {
            setLoading(false);
        }
    }, [currentPage, limit, statusFilter, startDate, endDate]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case BookingStatus.PENDING:
                return 'bg-amber-50 text-amber-600 border-amber-100';
            case BookingStatus.RESCHEDULED:
                return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case BookingStatus.CANCELLED:
                return 'bg-rose-50 text-rose-600 border-rose-100';
            case BookingStatus.COMPLETED:
                return 'bg-blue-50 text-blue-600 border-blue-100';
            default:
                return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    const getStatusIcon = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.CONFIRMED:
                return <CheckCircle2 size={14} />;
            case BookingStatus.PENDING:
                return <Clock4 size={14} />;
            case BookingStatus.RESCHEDULED:
                return <ArrowUpDown size={14} />;
            case BookingStatus.CANCELLED:
                return <XCircle size={14} />;
            case BookingStatus.COMPLETED:
                return <CheckCircle2 size={14} />;
            default:
                return <AlertCircle size={14} />;
        }
    };
    const filteredBookings = bookings.filter((booking) => {
        const mentorData = Array.isArray(booking.mentorId)
            ? booking.mentorId[0]
            : booking.mentorId;
        const mentor = mentorData as Mentor;
        const mentorName = mentor?.name || '';
        const topic = booking.topic || '';
        return (
            mentorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleReviewSubmit = async (rating: number, comment: string) => {
        if (!selectedBooking) return;
        try {
            const mentorData = Array.isArray(selectedBooking.mentorId)
                ? selectedBooking.mentorId[0]
                : selectedBooking.mentorId;
            const mentor = mentorData as Mentor;

            await reviewApi.submitReview({
                bookingId: selectedBooking.id,
                mentorId: (mentor as any).id || (mentor as any)._id || String(mentor),
                userId: selectedBooking.userId,
                rating,
                comment,
            });
            setIsReviewModalOpen(false);
            fetchBookings(); // Refresh to potentially hide the button if we had a flag
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || 'Failed to submit review'
            );
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-50/50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                            >
                                <Breadcrumbs />
                                <h1 className="text-4xl font-black text-gray-900 tracking-tight mt-2 flex items-center gap-3">
                                    Booking History
                                    <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-black tracking-widest uppercase align-middle shadow-lg shadow-indigo-200">
                                        {totalCount} Total
                                    </span>
                                </h1>
                                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mt-2">
                                    Manage and review your mentorship sessions
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="flex flex-wrap gap-4 items-center bg-white p-3 rounded-[24px] shadow-xl shadow-gray-100 border border-gray-100"
                            >
                                <div className="relative group">
                                    <Search
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors"
                                        size={18}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search by mentor or topic..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-12 pr-6 py-3 bg-gray-50 rounded-2xl border-none text-sm font-bold text-gray-900 focus:ring-2 focus:ring-indigo-500/20 transition-all w-full md:w-64"
                                    />
                                </div>
                                <div className="h-8 w-px bg-gray-100 hidden md:block" />
                                <button className="p-3 bg-gray-50 rounded-2xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                                    <Filter size={20} />
                                </button>
                            </motion.div>
                        </div>

                        {/* Filters Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
                        >
                            <div className="col-span-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block px-2">
                                    Status Filter
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => {
                                        setStatusFilter(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-black text-gray-900 uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
                                >
                                    <option value="all">All Bookings</option>
                                    <option value={BookingStatus.CONFIRMED}>
                                        Confirmed
                                    </option>
                                    <option value={BookingStatus.PENDING}>
                                        Pending
                                    </option>
                                    <option value={BookingStatus.COMPLETED}>
                                        Completed
                                    </option>
                                    <option value={BookingStatus.RESCHEDULED}>
                                        Rescheduled
                                    </option>
                                    <option value={BookingStatus.CANCELLED}>
                                        Cancelled
                                    </option>
                                </select>
                            </div>

                            <div className="col-span-1 md:col-span-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block px-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500/10 transition-all uppercase"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 block px-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full p-4 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500/10 transition-all uppercase"
                                />
                            </div>

                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setStatusFilter('all');
                                        setSearchTerm('');
                                        setStartDate('');
                                        setEndDate('');
                                        setCurrentPage(1);
                                    }}
                                    className="w-full p-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-95"
                                >
                                    Clear All
                                </button>
                            </div>
                        </motion.div>

                        {/* Content Grid */}
                        <div className="relative min-h-[400px]">
                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map((i) => (
                                        <div
                                            key={i}
                                            className="bg-white rounded-[32px] p-8 border border-gray-100 animate-pulse"
                                        >
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-14 h-14 bg-gray-100 rounded-2xl" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                                                    <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="h-20 bg-gray-50 rounded-2xl" />
                                                <div className="flex justify-between">
                                                    <div className="h-8 bg-gray-100 rounded-xl w-24" />
                                                    <div className="h-8 bg-gray-100 rounded-xl w-24" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : filteredBookings.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center p-20 bg-white rounded-[48px] border border-dashed border-gray-200"
                                >
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <CalendarDays
                                            size={48}
                                            className="text-gray-300"
                                        />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                                        No bookings found
                                    </h3>
                                    <p className="text-gray-400 font-bold text-center max-w-xs uppercase text-[10px] tracking-widest leading-relaxed">
                                        Try adjusting your filters or search
                                        terms to find what you're looking for.
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence mode="popLayout">
                                        {filteredBookings.map(
                                            (booking, index) => {
                                                const mentorData =
                                                    Array.isArray(
                                                        booking.mentorId
                                                    )
                                                        ? booking.mentorId[0]
                                                        : booking.mentorId;
                                                const mentor =
                                                    mentorData as Mentor;
                                                return (
                                                    <motion.div
                                                        layout
                                                        key={booking.id}
                                                        initial={{
                                                            opacity: 0,
                                                            y: 20,
                                                        }}
                                                        animate={{
                                                            opacity: 1,
                                                            y: 0,
                                                        }}
                                                        exit={{
                                                            opacity: 0,
                                                            scale: 0.95,
                                                        }}
                                                        transition={{
                                                            duration: 0.4,
                                                            delay: index * 0.05,
                                                        }}
                                                        className="group bg-white rounded-[32px] p-8 border border-gray-100 shadow-xl shadow-gray-200/20 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
                                                    >
                                                        {/* Background Accent */}
                                                        <div
                                                            className={`absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-10 blur-3xl rounded-full transition-opacity duration-700 ${getStatusColor(booking.status).split(' ')[0]}`}
                                                        />

                                                        <div className="flex items-center justify-between mb-8">
                                                            <div
                                                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusColor(booking.status)}`}
                                                            >
                                                                {getStatusIcon(
                                                                    booking.status
                                                                )}
                                                                {booking.status}
                                                            </div>
                                                            <button className="text-gray-300 hover:text-indigo-600 transition-colors">
                                                                <MoreHorizontal
                                                                    size={20}
                                                                />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center gap-4 mb-6">
                                                            <div className="relative">
                                                                {mentor?.profilePic ? (
                                                                    <img
                                                                        src={
                                                                            mentor.profilePic
                                                                        }
                                                                        alt={
                                                                            mentor.name
                                                                        }
                                                                        className="w-14 h-14 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform duration-500"
                                                                    />
                                                                ) : (
                                                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl">
                                                                        {mentor?.name?.charAt(
                                                                            0
                                                                        ) ||
                                                                            'M'}
                                                                    </div>
                                                                )}
                                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                                                                    <CheckCircle2
                                                                        size={
                                                                            12
                                                                        }
                                                                        className="text-indigo-600"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                                                                    {mentor?.name ||
                                                                        'Mentor'}
                                                                </h4>
                                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                                                                    {mentor?.expertise ||
                                                                        mentor?.domain ||
                                                                        'Expert Mentor'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gray-50/50 rounded-2xl p-5 mb-6 border border-gray-50 group-hover:bg-indigo-50/30 transition-colors duration-500">
                                                            <h5 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-3">
                                                                Session Details
                                                            </h5>
                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-3 text-gray-700">
                                                                    <Calendar
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-gray-400"
                                                                    />
                                                                    <span className="text-sm font-bold tracking-tight">
                                                                        {format(
                                                                            new Date(
                                                                                booking.bookingDate
                                                                            ),
                                                                            'MMMM do, yyyy'
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-3 text-gray-700">
                                                                    <Clock
                                                                        size={
                                                                            14
                                                                        }
                                                                        className="text-gray-400"
                                                                    />
                                                                    <span className="text-sm font-bold tracking-tight">
                                                                        {
                                                                            booking.slot
                                                                        }
                                                                    </span>
                                                                </div>
                                                                {booking.topic && (
                                                                    <div className="pt-2 mt-2 border-t border-gray-200/50">
                                                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                                                                            Topic
                                                                        </p>
                                                                        <p className="text-xs font-black text-gray-900 line-clamp-1">
                                                                            {
                                                                                booking.topic
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-3">
                                                            {booking.meetingLink &&
                                                                booking.status ===
                                                                    BookingStatus.CONFIRMED && (
                                                                    <a
                                                                        href={
                                                                            booking.meetingLink
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="flex-1 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
                                                                    >
                                                                        <ExternalLink
                                                                            size={
                                                                                14
                                                                            }
                                                                        />
                                                                        Go to
                                                                        Room
                                                                    </a>
                                                                )}
                                                            <button
                                                                onClick={() =>
                                                                    toast.info(
                                                                        'Booking details coming soon'
                                                                    )
                                                                }
                                                                className={`flex-1 py-3.5 bg-white border border-gray-100 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95 ${!booking.meetingLink || booking.status !== BookingStatus.CONFIRMED ? 'col-span-2' : ''}`}
                                                            >
                                                                View Details
                                                            </button>
                                                            {booking.status ===
                                                                BookingStatus.COMPLETED && (
                                                                <button
                                                                    onClick={() => {
                                                                        setSelectedBooking(
                                                                            booking
                                                                        );
                                                                        setIsReviewModalOpen(
                                                                            true
                                                                        );
                                                                    }}
                                                                    className="flex-1 py-3.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
                                                                >
                                                                    <Star
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                    Review
                                                                </button>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            }
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-12 flex justify-center items-center gap-4"
                            >
                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm active:scale-95"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() =>
                                                handlePageChange(i + 1)
                                            }
                                            className={`w-12 h-12 rounded-2xl text-xs font-black transition-all active:scale-95 ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-white transition-all shadow-sm active:scale-95"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>

            {selectedBooking && (
                <ReviewModal
                    isOpen={isReviewModalOpen}
                    onClose={() => setIsReviewModalOpen(false)}
                    onSubmit={handleReviewSubmit}
                    mentorName={
                        (
                            (Array.isArray(selectedBooking.mentorId)
                                ? selectedBooking.mentorId[0]
                                : selectedBooking.mentorId) as Mentor
                        )?.name || 'Mentor'
                    }
                    canSkip={true}
                />
            )}
        </div>
    );
};

export default BookingHistoryPage;
