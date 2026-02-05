import React, { useEffect, useState } from 'react';
import { bookingApi } from '@/Services/booking.api';
import type { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking';
import { toast } from 'sonner';
import { 
    Calendar, 
    Clock, 
    CheckCircle2, 
    XCircle, 
    ChevronLeft,
    ChevronRight,
    Home
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 3;

const BookingRequestsPage: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const data = await bookingApi.getMentorBookings(
                currentPage,
                ITEMS_PER_PAGE,
                BookingStatus.PENDING
            );
            setBookings(data.bookings);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            toast.error('Failed to load booking requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [currentPage]);

    const handleUpdateStatus = async (
        bookingId: string,
        status: BookingStatus
    ) => {
        try {
            await bookingApi.updateStatus({ bookingId, status });
            toast.success(
                `Booking ${status === BookingStatus.CONFIRMED ? 'accepted' : 'rejected'} successfully`
            );
            fetchBookings(); // Refresh list
        } catch (error) {
            const errorMessage =
                (error as { response?: { data?: { message?: string } } })
                    ?.response?.data?.message || 'Failed to update status';
            toast.error(errorMessage);
        }
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                <Link to="/mentor/dashboard" className="hover:text-indigo-600 flex items-center gap-1">
                    <Home size={16} />
                    Dashboard
                </Link>
                <ChevronRight size={14} />
                <span className="text-gray-900 font-semibold">Booking Requests</span>
            </nav>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    Booking Requests
                    <span className="bg-indigo-100 text-indigo-600 text-sm font-bold px-3 py-1 rounded-full">
                        {totalCount} Pending
                    </span>
                </h1>
                <p className="text-gray-500 mt-2">Manage session requests from your mentees.</p>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-[32px] border border-gray-100 p-16 text-center shadow-lg shadow-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No pending requests</h3>
                    <p className="text-gray-500">You're all caught up! No new booking requests to review.</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookings.map((booking) => (
                            <div 
                                key={booking.id} 
                                className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-xl shadow-indigo-100/20 hover:shadow-indigo-100/50 transition-all group hover:-translate-y-1"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center text-indigo-600 border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <span className="text-[10px] font-black uppercase tracking-tighter leading-none mb-0.5">
                                            {format(new Date(booking.bookingDate), 'MMM')}
                                        </span>
                                        <span className="text-xl font-black leading-none">
                                            {format(new Date(booking.bookingDate), 'd')}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full mb-1">
                                            <Clock size={12} className="text-gray-500" />
                                            <span className="text-xs font-bold text-gray-600">{booking.slot}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1" title={booking.topic}>
                                        {booking.topic || 'Mentorship Session'}
                                    </h4>

                                </div>

                                {/* User Info (If available in booking, depends on backend expansion) */}
                                {/* Assuming userId might be populated or we just show generic 'Student' if not */}
                                <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-2xl">
                                    <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        S
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Mentee</p>
                                        <p className="text-[10px] text-gray-500 font-medium">Session Request</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => handleUpdateStatus(booking.id, BookingStatus.CONFIRMED)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white text-xs font-black rounded-xl hover:bg-green-600 transition-all active:scale-95 shadow-lg shadow-gray-200 hover:shadow-green-200"
                                    >
                                        <CheckCircle2 size={16} />
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleUpdateStatus(booking.id, BookingStatus.CANCELLED)}
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 text-gray-500 text-xs font-black rounded-xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                                    >
                                        <XCircle size={16} />
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 mt-12">
                            <button
                                onClick={() => goToPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => goToPage(page)}
                                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                                            currentPage === page
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 transform scale-110'
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-transparent hover:border-gray-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => goToPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default BookingRequestsPage;
