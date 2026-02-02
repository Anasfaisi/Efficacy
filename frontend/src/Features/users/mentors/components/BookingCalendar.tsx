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
    isBefore, 
    startOfDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import type { Mentor } from '@/types/auth';

import { getAllSlots } from '@/utils/timeUtils';

interface BookingCalendarProps {
    mentor: Mentor;
    onSelectSlot: (date: Date, slot: string) => void;
    bookedSlots?: { date: string, slot: string }[]; // Optional: existing bookings to gray out
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ mentor, onSelectSlot, bookedSlots = [] }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const renderHeader = () => {
        return (
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-xl font-bold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                        disabled={isBefore(startOfMonth(currentMonth), startOfMonth(new Date()))}
                    >
                        <ChevronLeft size={20} className="text-gray-600" />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <ChevronRight size={20} className="text-gray-600" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        return (
            <div className="grid grid-cols-7 mb-2">
                {dayNames.map((day) => (
                    <div key={day} className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {day}
                        
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const rows = [];
        let days = [];
        let day = startDate;
        let formattedDate = "";

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = format(day, "d");
                const cloneDay = day;
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isPast = isBefore(startOfDay(day), startOfDay(new Date()));
                
                const currentDayName = format(day, 'EEEE');
                const isAvailableDay = mentor.availableDays?.includes(currentDayName);

                const isDisabled = !isCurrentMonth || isPast || !isAvailableDay;

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative group h-12 flex flex-col items-center justify-center cursor-pointer transition-all rounded-xl
                            ${isSelected ? 'bg-[#7F00FF] text-white shadow-lg shadow-[#7F00FF]/30' : ''}
                            ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:bg-[#7F00FF]/10'}
                            ${!isDisabled && !isSelected ? 'text-gray-900 font-bold' : ''}
                        `}
                        onClick={() => !isDisabled && setSelectedDate(cloneDay)}
                    >
                        <span className="text-sm">{formattedDate}</span>
                        {!isDisabled && !isSelected && (
                            <div className="absolute bottom-1 w-1 h-1 bg-[#7F00FF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }
        return <div className="space-y-1">{rows}</div>;
    };

    const renderSlots = () => {
        if (!selectedDate) return null;

        const allPossibleSlots = getAllSlots(mentor.preferredTime || []);
        
        return (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock size={14} /> Available Slots for {format(selectedDate, 'MMM d')}
                    </h3>
                    <span className="text-[10px] font-bold text-[#7F00FF] bg-[#7F00FF]/10 px-2 py-1 rounded-md">
                        1 HOUR EACH
                    </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {allPossibleSlots.length > 0 ? (
                        allPossibleSlots.map((slot) => {
                            const isBooked = bookedSlots.some(bs => 
                                isSameDay(new Date(bs.date), selectedDate) && bs.slot === slot
                            );
                            
                            return (
                                <button
                                    key={slot}
                                    disabled={isBooked}
                                    onClick={() => onSelectSlot(selectedDate, slot)}
                                    className={`relative group py-2 px-3 text-[11px] font-bold rounded-xl border transition-all duration-300
                                        ${isBooked 
                                            ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' 
                                            : 'bg-white text-gray-700 border-gray-100 hover:border-[#7F00FF] hover:text-[#7F00FF] hover:shadow-lg hover:-translate-y-0.5 active:scale-95'
                                        }
                                    `}
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="opacity-80 font-medium">Session</span>
                                        <span className="text-[12px]">{slot}</span>
                                    </div>
                                    {!isBooked && (
                                        <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full shadow-sm" />
                                    )}
                                </button>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-8 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-500 font-medium">No slots available for this day.</p>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">Please select another date</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl overflow-hidden">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="min-h-[140px]">
                {renderSlots()}
            </div>
        </div>
    );
};


export default BookingCalendar;
