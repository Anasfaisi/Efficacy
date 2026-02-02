import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
    Calendar, 
    Clock, 
    ExternalLink, 
    CheckCircle2, 
    XCircle, 
    ArrowLeft,
    User,
    Mail,
    Phone,
    MessageSquare,
    MoreVertical,
    TrendingUp,
    AlertCircle,
    Info,
    CheckCircle,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { mentorshipApi } from '@/Services/mentorship.api';
import { bookingApi } from '@/Services/booking.api';
import type { Mentorship } from '@/types/mentorship';
import type { Booking } from '@/types/booking';
import { BookingStatus } from '@/types/booking';
import BookingCalendar from '@/Features/users/mentors/components/BookingCalendar';
import { useAppDispatch } from '@/redux/hooks';
import { setCurrentConversation } from '@/redux/slices/chatSlice';
import { chatApi } from '@/Services/chat.api';

import type { User as UserType, Mentor as MentorType } from '@/types/auth';

const MentorMentorshipManagementPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [mentorship, setMentorship] = useState<Mentorship | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!id) return;
        try {
            const mentorshipData = await mentorshipApi.getMentorshipById(id);
            setMentorship(mentorshipData);

            const allBookings = await bookingApi.getMentorBookings();
            const studentId = (mentorshipData.userId as UserType)?._id || (mentorshipData.userId as UserType)?.id;
            const filtered = allBookings.filter(b => 
                b.userId === studentId
            );
            setBookings(filtered);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Could not load mentorship details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleUpdateBookingStatus = async (bookingId: string, status: BookingStatus) => {
        try {
            await bookingApi.updateStatus({ bookingId, status });
            toast.success(`Booking ${status} successfully`);
            fetchData();
        } catch (error) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update status';
            toast.error(errorMessage);
        }
    };

    const handleChat = async () => {
        if (!mentorship?.userId) return;
        try {
            const student = mentorship.userId as UserType;
            const userId = student._id || student.id;
            const conversation = await chatApi.initiateChat(userId);
            dispatch(setCurrentConversation(conversation));
            navigate('/mentor/chat');
        } catch (error) {
            console.error('Failed to initiate chat', error);
            toast.error('Failed to open chat');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="text-indigo-600 animate-pulse" size={24} />
                </div>
            </div>
        </div>
    );

    if (!mentorship) return (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xl">
            <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Mentorship not found</h2>
            <button onClick={() => navigate('/mentor/sessions')} className="mt-4 text-indigo-600 font-bold hover:underline">
                Back to Active Mentorships
            </button>
        </div>
    );

    const student = mentorship.userId as UserType;
    const pendingBookings = bookings.filter(b => b.status === BookingStatus.PENDING);
    const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto pb-12"
        >
            {/* Header / Breadcrumbs */}
            <div className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate('/mentor/sessions')}
                    className="p-3 bg-white border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        <span>Mentorships</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="text-indigo-500">Mentee Profile Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Mentorship Dashboard</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Stats & Details */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Mentee Profile Card */}
                    <div className="bg-white rounded-[40px] p-8 md:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-indigo-50/50 group-hover:text-indigo-100/50 transition-colors pointer-events-none">
                            <User size={180} />
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                            <div className="relative">
                                <img 
                                    src={student?.profilePic || `https://ui-avatars.com/api/?name=${student?.name}`} 
                                    className="w-32 h-32 rounded-[32px] object-cover ring-8 ring-indigo-50 shadow-2xl"
                                    alt={student?.name}
                                />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                    <CheckCircle size={16} className="text-white" />
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900">{student?.name}</h2>
                                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-wider">
                                        Active Student
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                                            <Mail size={16} />
                                        </div>
                                        <span className="text-sm font-semibold truncate">{student?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50/50 p-2.5 rounded-2xl border border-gray-100/50">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-500">
                                            <Phone size={16} />
                                        </div>
                                        <span className="text-sm font-semibold">{student?.phone || 'No phone provided'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button 
                                        onClick={handleChat}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-black transition-all shadow-xl shadow-indigo-200 active:scale-95"
                                    >
                                        <MessageSquare size={18} />
                                        Chat
                                    </button>
                                    <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-900 font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95">
                                        <Info size={18} />
                                        Profile
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Progress Stats */}
                        <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-50">
                            <div>
                                <p className="text-3xl font-black text-indigo-600">{mentorship.totalSessions}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Goal</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-green-500">{mentorship.usedSessions}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Completed</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black text-orange-500">{mentorship.totalSessions - mentorship.usedSessions}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Left to go</p>
                            </div>
                        </div>
                    </div>

                    {/* Pending Appointment Requests */}
                    <AnimatePresence>
                        {pendingBookings.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between px-2">
                                    <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                                        Appointment Requests
                                    </h3>
                                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                                        {pendingBookings.length} NEW REQUESTS
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {pendingBookings.map((booking) => (
                                        <div key={booking.id} className="bg-white p-6 rounded-[32px] border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 hover:shadow-indigo-200/50 transition-all group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex flex-col items-center justify-center text-indigo-600 border border-indigo-100">
                                                    <span className="text-[10px] font-black uppercase tracking-tighter leading-none">{format(new Date(booking.bookingDate), 'MMM')}</span>
                                                    <span className="text-xl font-black leading-none mt-1">{format(new Date(booking.bookingDate), 'd')}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-gray-400 uppercase tracking-tight">Time Slot</p>
                                                    <p className="text-sm font-bold text-indigo-600">{booking.slot}</p>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-4 line-clamp-1">{booking.topic || 'Mentorship Session'}</h4>
                                            
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.CONFIRMED)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-black text-white text-xs font-black rounded-xl hover:bg-green-600 transition-all active:scale-95"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    Approve
                                                </button>
                                                <button 
                                                    onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.CANCELLED)}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 text-gray-500 text-xs font-black rounded-xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Booked Sessions List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-black text-gray-900">Scheduled Sessions</h3>
                            <button className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest">View History</button>
                        </div>
                        
                        <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden">
                            <div className="divide-y divide-gray-50">
                                {confirmedBookings.length === 0 ? (
                                    <div className="p-20 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200 text-gray-300">
                                            <Calendar size={24} />
                                        </div>
                                        <p className="text-gray-500 font-bold">No sessions scheduled for this student</p>
                                        <p className="text-xs text-gray-400 mt-1 uppercase font-black tracking-widest">Awaiting student selection</p>
                                    </div>
                                ) : (
                                    confirmedBookings.map((booking) => (
                                        <div key={booking.id} className="p-8 hover:bg-gray-50/80 transition-all group relative">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center text-gray-900 group-hover:scale-110 transition-transform border border-gray-100 shadow-sm relative">
                                                        <span className="text-[10px] font-black uppercase text-indigo-500 leading-none mb-1">{format(new Date(booking.bookingDate), 'MMM')}</span>
                                                        <span className="text-2xl font-black leading-none">{format(new Date(booking.bookingDate), 'd')}</span>
                                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{booking.topic || 'Mentorship Session'}</h4>
                                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                            <div className="flex items-center gap-2">
                                                                <Clock size={14} className="text-indigo-400" />
                                                                {booking.slot}
                                                            </div>
                                                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle2 size={14} className="text-green-500" />
                                                                CONFIRMED
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {booking.status === BookingStatus.CONFIRMED && (
                                                        <button 
                                                            onClick={() => handleUpdateBookingStatus(booking.id, BookingStatus.COMPLETED)}
                                                            className="flex items-center gap-2 px-4 py-3 bg-green-50 text-green-600 text-xs font-black rounded-2xl hover:bg-green-600 hover:text-white transition-all border border-green-100"
                                                        >
                                                            <Check size={14} />
                                                            DONE
                                                        </button>
                                                    )}
                                                    {booking.status === BookingStatus.CONFIRMED && (
                                                        <button 
                                                            onClick={() => navigate(`/meet/${booking.id}`)}
                                                            className="flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-black rounded-2xl hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                                                        >
                                                            <ExternalLink size={14} />
                                                            START CALL
                                                        </button>
                                                    )}
                                                    <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:bg-white hover:text-red-500 hover:border-red-100 transition-all shadow-sm active:scale-95">
                                                        <MoreVertical size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Schedule & Calendar */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Mentor's Calendar View for this Mentee */}
                    <div className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-2xl shadow-gray-200/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tighter flex items-center gap-2">
                                <Calendar size={20} className="text-indigo-600" />
                                Schedule View
                            </h3>
                            <Info size={18} className="text-gray-300 cursor-help" />
                        </div>
                        
                        <div className="mb-6">
                            {mentorship.mentorId && (
                                <BookingCalendar 
                                    mentor={mentorship.mentorId as MentorType} 
                                    onSelectSlot={() => {}} 
                                    bookedSlots={bookings.map(b => ({
                                        date: b.bookingDate,
                                        slot: b.slot
                                    }))}
                                />
                            )}
                        </div>
                        
                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                            <p className="text-[11px] font-bold text-indigo-700 leading-relaxed">
                                <span className="font-black uppercase tracking-widest mr-1">Note:</span>
                                Only sessions for this mentee are highlighted here. Approved sessions are locked automatically.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </motion.div>
    );
};

export default MentorMentorshipManagementPage;
