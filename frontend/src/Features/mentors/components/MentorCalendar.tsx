import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval,
    isToday,
    addWeeks,
    subWeeks,
} from 'date-fns';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Calendar as CalendarIcon,
    LayoutGrid,
    Columns,
    User,
    CheckCircle2,
    ArrowLeft,
    Plus,
    Settings2,
    ChevronDown,
} from 'lucide-react';
import type { Mentor } from '@/types/auth';
import type { Booking } from '@/types/booking';
import { getAllSlots } from '@/utils/timeUtils';

interface MentorCalendarProps {
    mentor: Mentor;
    allBookings: Booking[];
    currentMenteeId?: string;
    onSelectSlot?: (date: Date, slot: string) => void;
    selectable?: boolean;
}

type ViewType = 'month' | 'week' | 'day';

const MentorCalendar: React.FC<MentorCalendarProps> = ({
    mentor,
    allBookings,
    currentMenteeId,
    onSelectSlot,
    selectable,
}) => {
    const [view, setView] = useState<ViewType>('month');
    const [isViewSelectorOpen, setIsViewSelectorOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(() => {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        return d;
    });

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getBookingsForDate = (date: Date) => {
        return allBookings.filter((b) => {
            if (b.status === 'cancelled') return false;

            if (b.status === 'rescheduled' && b.proposedDate) {
                return isSameDay(new Date(b.proposedDate), date);
            }

            return isSameDay(new Date(b.bookingDate), date);
        });
    };

    const navigate = (direction: 'prev' | 'next') => {
        let newDate = new Date(currentDate);
        if (view === 'month') {
            newDate =
                direction === 'prev'
                    ? subMonths(newDate, 1)
                    : addMonths(newDate, 1);
            // Always set to 1st of month when navigating months to avoid clipping issues
            newDate = startOfMonth(newDate);
        } else if (view === 'week') {
            newDate =
                direction === 'prev'
                    ? subWeeks(newDate, 1)
                    : addWeeks(newDate, 1);
        } else {
            newDate =
                direction === 'prev'
                    ? addDays(newDate, -1)
                    : addDays(newDate, 1);
        }

        newDate.setHours(12, 0, 0, 0);
        setCurrentDate(newDate);
    };

    const renderHeader = () => {
        let title = '';
        if (view === 'month') title = format(currentDate, 'MMMM yyyy');
        else if (view === 'week') {
            const start = startOfWeek(currentDate);
            const end = endOfWeek(currentDate);
            title = `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
        } else {
            title = format(currentDate, 'EEEE, MMMM d, yyyy');
        }

        return (
            <div className="flex flex-col gap-6 mb-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
                            {title}
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                                {view} View Active
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Expand/Toggle Button for compressed layouts */}
                        <button
                            onClick={() =>
                                setIsViewSelectorOpen(!isViewSelectorOpen)
                            }
                            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black tracking-widest shadow-lg shadow-indigo-100 active:scale-95 transition-all uppercase"
                        >
                            <Settings2 size={14} />
                            {isViewSelectorOpen ? 'Close' : 'View'}
                            <ChevronDown
                                size={12}
                                className={`transition-transform duration-300 ${isViewSelectorOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        <div className="flex items-center bg-gray-100/80 p-1 rounded-xl border border-gray-200/50 shadow-inner">
                            <button
                                onClick={() => navigate('prev')}
                                className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all active:scale-90 text-gray-600 hover:text-indigo-600"
                                title="Previous"
                            >
                                <ChevronLeft size={20} strokeWidth={3} />
                            </button>
                            <button
                                onClick={() => {
                                    const d = new Date();
                                    d.setHours(12, 0, 0, 0);
                                    setCurrentDate(d);
                                }}
                                className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 transition-colors border-x border-gray-200/50"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => navigate('next')}
                                className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all active:scale-90 text-gray-600 hover:text-indigo-600"
                                title="Next"
                            >
                                <ChevronRight size={20} strokeWidth={3} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    {view !== 'month' && (
                        <button
                            onClick={() => setView('month')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[10px] font-black text-gray-500 uppercase tracking-widest rounded-xl transition-all border border-gray-200 mb-2"
                        >
                            <ArrowLeft size={14} />
                            Back to full month
                        </button>
                    )}

                    <div
                        className={`
                        ${isViewSelectorOpen ? 'flex opacity-100 translate-y-0 scale-100' : 'hidden lg:flex opacity-0 lg:opacity-100 translate-y-4 lg:translate-y-0 scale-95 lg:scale-100'}
                        flex-col lg:flex-row absolute lg:relative top-0 lg:top-0 right-0 z-[100] lg:z-10 bg-white lg:bg-gray-100/50 p-2 lg:p-1 rounded-2xl lg:rounded-xl border border-gray-200 shadow-2xl lg:shadow-none backdrop-blur-xl transition-all duration-300 min-w-[180px] lg:min-w-0 lg:border-none lg:backdrop-blur-none
                    `}
                    >
                        <button
                            onClick={() => {
                                setView('month');
                                setIsViewSelectorOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 lg:py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer active:scale-95 ${view === 'month' ? 'bg-indigo-600 lg:bg-white text-white lg:text-indigo-600 shadow-lg lg:shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <LayoutGrid size={14} />
                            MONTH
                        </button>
                        <button
                            onClick={() => {
                                setView('week');
                                setIsViewSelectorOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 lg:py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer active:scale-95 ${view === 'week' ? 'bg-indigo-600 lg:bg-white text-white lg:text-indigo-600 shadow-lg lg:shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Columns size={14} />
                            WEEK
                        </button>
                        <button
                            onClick={() => {
                                setView('day');
                                setIsViewSelectorOpen(false);
                            }}
                            className={`flex items-center gap-3 px-4 py-3 lg:py-2 rounded-lg text-[10px] font-black transition-all cursor-pointer active:scale-95 ${view === 'day' ? 'bg-indigo-600 lg:bg-white text-white lg:text-indigo-600 shadow-lg lg:shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Clock size={14} />
                            DAY
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderMonthView = () => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const days = eachDayOfInterval({ start: startDate, end: endDate });

        return (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-7 mb-4">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {days.map((day) => {
                        const isCurrentMonth = isSameMonth(day, monthStart);
                        const bookings = getBookingsForDate(day);
                        const hasCurrentMentee = bookings.some(
                            (b) => b.userId === currentMenteeId
                        );

                        return (
                            <div
                                key={day.toString()}
                                onClick={() => {
                                    const dateWithNoon = new Date(day);
                                    dateWithNoon.setHours(12, 0, 0, 0);
                                    setCurrentDate(dateWithNoon);
                                    setView('day');
                                }}
                                className={`group min-h-[90px] p-1 border rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-start gap-1
                                    ${!isCurrentMonth ? 'bg-gray-50/50 border-transparent opacity-30 grayscale cursor-default pointer-events-none' : 'bg-white border-gray-100 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1'}
                                    ${isToday(day) ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                                    ${bookings.length > 0 && isCurrentMonth ? 'bg-indigo-50/30' : ''}
                                `}
                            >
                                <div
                                    className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${bookings.length > 0 ? (hasCurrentMentee ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-green-500 text-white shadow-lg shadow-green-100') : ''}`}
                                >
                                    <span
                                        className={`text-sm font-black ${!bookings.length && isToday(day) ? 'text-indigo-600' : ''}`}
                                    >
                                        {format(day, 'd')}
                                    </span>
                                </div>

                                <div className="flex flex-wrap justify-center gap-0.5 mt-auto pb-1">
                                    {bookings.slice(0, 4).map((b, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-1 h-1 rounded-full ${b.userId === currentMenteeId ? 'bg-indigo-400' : 'bg-green-300'}`}
                                        />
                                    ))}
                                    {bookings.length > 4 && (
                                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const start = startOfWeek(currentDate);
        const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
        const allPossibleSlots = getAllSlots(mentor.preferredTime || []);

        return (
            <div className="overflow-x-auto animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 mb-4">
                        <div /> {/* Top-left empty corner */}
                        {days.map((day) => (
                            <div
                                key={day.toString()}
                                className={`text-center p-3 rounded-2xl border ${isToday(day) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white border-gray-100'}`}
                            >
                                <p
                                    className={`text-[10px] font-black uppercase tracking-widest ${isToday(day) ? 'text-indigo-100' : 'text-gray-400'}`}
                                >
                                    {format(day, 'EEE')}
                                </p>
                                <p className="text-xl font-black">
                                    {format(day, 'd')}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        {allPossibleSlots.map((slot) => (
                            <div
                                key={slot}
                                className="grid grid-cols-[80px_repeat(7,1fr)] gap-2 group"
                            >
                                <div className="text-[10px] font-black text-gray-400 flex items-center justify-end pr-4 uppercase tracking-tighter">
                                    {slot.split('-')[0]}
                                </div>
                                {days.map((day) => {
                                    const bookings = getBookingsForDate(
                                        day
                                    ).filter((b) => {
                                        if (
                                            b.status === 'rescheduled' &&
                                            b.proposedDate
                                        ) {
                                            return b.proposedSlot === slot;
                                        }
                                        return b.slot === slot;
                                    });
                                    const isBooked = bookings.length > 0;
                                    const booking = bookings[0];
                                    const isCurrentMentee =
                                        booking?.userId === currentMenteeId;

                                    return (
                                        <div
                                            key={day.toString()}
                                            onClick={() => {
                                                if (
                                                    !isBooked &&
                                                    selectable &&
                                                    onSelectSlot
                                                ) {
                                                    const dateWithNoon =
                                                        new Date(day);
                                                    dateWithNoon.setHours(
                                                        12,
                                                        0,
                                                        0,
                                                        0
                                                    );
                                                    onSelectSlot(
                                                        dateWithNoon,
                                                        slot
                                                    );
                                                }
                                            }}
                                            className={`min-h-[60px] rounded-2xl border-2 border-dashed flex items-center justify-center p-2 transition-all
                                                ${
                                                    isBooked
                                                        ? isCurrentMentee
                                                            ? 'bg-indigo-50 border-indigo-500 border-solid shadow-sm'
                                                            : 'bg-green-50 border-green-500 border-solid opacity-60'
                                                        : !selectable
                                                          ? 'bg-gray-50/20 border-gray-100 hover:bg-gray-50 hover:border-gray-300'
                                                          : 'bg-indigo-50/20 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 cursor-pointer'
                                                }
                                            `}
                                        >
                                            {isBooked ? (
                                                <div className="flex flex-col items-center gap-1 text-center">
                                                    <div
                                                        className={`p-1 rounded-full ${isCurrentMentee ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}
                                                    >
                                                        {isCurrentMentee ? (
                                                            <User size={12} />
                                                        ) : (
                                                            <CheckCircle2
                                                                size={12}
                                                            />
                                                        )}
                                                    </div>
                                                    <p
                                                        className={`text-[9px] font-black uppercase tracking-tighter truncate w-full ${isCurrentMentee ? 'text-indigo-600' : 'text-green-600'}`}
                                                    >
                                                        {isCurrentMentee
                                                            ? 'Active Mentee'
                                                            : 'Booked'}
                                                    </p>
                                                </div>
                                            ) : (
                                                selectable && (
                                                    <div className="text-indigo-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all">
                                                        <Plus size={16} />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const allPossibleSlots = getAllSlots(mentor.preferredTime || []);
        const todayBookings = getBookingsForDate(currentDate);

        return (
            <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100 mb-8 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">
                            Today's Overview
                        </p>
                        <h3 className="text-xl font-black text-gray-900">
                            {todayBookings.length} Scheduled Sessions
                        </h3>
                    </div>
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600 border border-gray-100">
                        <CalendarIcon size={24} />
                    </div>
                </div>

                <div className="space-y-4">
                    {allPossibleSlots.map((slot) => {
                        const bookings = todayBookings.filter((b) => {
                            if (b.status === 'rescheduled' && b.proposedDate) {
                                return b.proposedSlot === slot;
                            }
                            return b.slot === slot;
                        });
                        const isBooked = bookings.length > 0;
                        const booking = bookings[0];
                        const isCurrentMentee =
                            booking?.userId === currentMenteeId;

                        return (
                            <div
                                key={slot}
                                className={`flex items-stretch gap-4 p-4 rounded-3xl border transition-all ${isBooked ? (isCurrentMentee ? 'bg-white border-indigo-100 shadow-xl shadow-indigo-100/50 scale-[1.02]' : 'bg-gray-50 border-gray-100 opacity-60') : 'bg-white border-dashed border-gray-200 opacity-40 hover:opacity-100'}`}
                            >
                                <div className="w-24 flex flex-col items-center justify-center border-r border-gray-100 pr-4">
                                    <Clock
                                        size={16}
                                        className="text-gray-400 mb-1"
                                    />
                                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter text-center">
                                        {slot.split(' - ')[0]}
                                    </span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase">
                                        {slot.split(' - ')[1]}
                                    </span>
                                </div>

                                <div
                                    onClick={() => {
                                        if (
                                            !isBooked &&
                                            selectable &&
                                            onSelectSlot
                                        ) {
                                            const dateWithNoon = new Date(
                                                currentDate
                                            );
                                            dateWithNoon.setHours(12, 0, 0, 0);
                                            onSelectSlot(dateWithNoon, slot);
                                        }
                                    }}
                                    className={`flex-1 flex items-center justify-between pl-2 ${!isBooked && selectable ? 'cursor-pointer hover:bg-indigo-50/50 rounded-2xl transition-colors' : ''}`}
                                >
                                    <div>
                                        {isBooked ? (
                                            <>
                                                <h4
                                                    className={`font-black uppercase tracking-tight ${isCurrentMentee ? 'text-indigo-600' : 'text-gray-600'}`}
                                                >
                                                    {isCurrentMentee
                                                        ? 'Session with current mentee'
                                                        : 'Mentorship Session'}
                                                </h4>
                                                <p className="text-xs text-gray-400 font-bold">
                                                    {booking.topic ||
                                                        'No topic specified'}
                                                </p>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
                                                    Available Slot
                                                </span>
                                                {selectable && (
                                                    <Plus
                                                        size={12}
                                                        className="text-indigo-300"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {isBooked && (
                                        <div
                                            className={`p-2 rounded-xl ${isCurrentMentee ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}
                                        >
                                            <CheckCircle2 size={18} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white/40 backdrop-blur-xl rounded-[40px] p-8 border border-white/20 shadow-2xl relative overflow-hidden group">
            {/* Background Decorative Blurs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-500/5 blur-[100px] rounded-full group-hover:bg-green-500/10 transition-colors pointer-events-none" />

            {renderHeader()}

            <div className="relative z-10">
                {view === 'month' && renderMonthView()}
                {view === 'week' && renderWeekView()}
                {view === 'day' && renderDayView()}
            </div>

            {/* Legend */}
            <div className="mt-8 pt-8 border-t border-gray-100/50 flex flex-wrap gap-6 items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Current Mentee
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Other Bookings
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-dashed border-gray-300 rounded-full" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        Available
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MentorCalendar;
