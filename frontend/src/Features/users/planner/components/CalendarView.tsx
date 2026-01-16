import React, { useState, useMemo } from 'react';
import type { IPlannerTask } from '../types';
import { Priority } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';

interface CalendarViewProps {
    tasks: IPlannerTask[];
    onTaskClick: (task: IPlannerTask) => void;
    onSlotClick: (date: Date, hour: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onTaskClick, onSlotClick }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'week' | 'month'>('week');

    const weekDays = useMemo(() => {
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() - currentDate.getDay());
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            return d;
        });
    }, [currentDate]);

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (view === 'week') newDate.setDate(currentDate.getDate() - 7);
        else if (view === 'day') newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (view === 'week') newDate.setDate(currentDate.getDate() + 7);
        else if (view === 'day') newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const handleToday = () => setCurrentDate(new Date());

    const getTaskStyle = (task: IPlannerTask) => {
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);
        const startHour = start.getHours() + start.getMinutes() / 60;
        const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        const top = `${startHour * 64}px`;
        const height = `${Math.max(duration * 64, 28)}px`;

        let colorClasses = 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20';
        if (task.priority === Priority.HIGH) colorClasses = 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100';
        else if (task.priority === Priority.MEDIUM) colorClasses = 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100';
        else if (task.priority === Priority.LOW) colorClasses = 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100';

        if (task.completed) {
            colorClasses = 'bg-gray-50 border-gray-100 text-gray-400 line-through';
        }

        return { top, height, colorClasses };
    };

    return (
        <div className="h-full flex flex-col bg-white select-none">
            {/* Toolbar */}
            <div className="px-8 py-3 border-b border-gray-100 flex items-center justify-between bg-white z-30">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleToday}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all hover:border-gray-300 active:scale-95"
                    >
                        Today
                    </button>
                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg">
                        <button onClick={handlePrev} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                            <ChevronLeft size={18} />
                        </button>
                        <button onClick={handleNext} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600">
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight">
                        {format(currentDate, 'MMMM yyyy')}
                    </span>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/50">
                    {(['day', 'week', 'month'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={cn(
                                "px-5 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all",
                                view === v ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"
                            )}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
                <div className="min-w-[900px]">
                    {/* Sticky Header Row */}
                    <div className="sticky top-0 z-20 flex bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm h-28">
                        {/* Time labels corner */}
                        <div className="w-20 flex-shrink-0 border-r border-gray-100 flex items-end justify-end pb-4 pr-3">
                             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                GMT{format(new Date(), 'xxx')}
                             </span>
                        </div>
                        {/* Day headers */}
                        {weekDays.map((day) => {
                            const isToday = isSameDay(day, new Date());
                            return (
                                <div key={day.toISOString()} className="flex-1 border-r border-gray-100 flex flex-col items-center justify-center group">
                                    <p className={cn(
                                        "text-[10px] font-bold uppercase tracking-[0.2em] transition-colors",
                                        isToday ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                                    )}>
                                        {format(day, 'EEE')}
                                    </p>
                                    <p className={cn(
                                        "text-2xl font-black mt-1.5 w-12 h-12 flex items-center justify-center rounded-full transition-all",
                                        isToday ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-gray-900 group-hover:bg-gray-50"
                                    )}>
                                        {day.getDate()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Grid Body */}
                    <div className="flex relative">
                        {/* Time labels column */}
                        <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-white">
                            {HOURS.map((hour) => (
                                <div key={hour} className="h-16 relative">
                                    {/* The label is centered on the top line of each 64px box */}
                                    <div className="absolute -top-2.5 right-3">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {hour === 0 ? '' : `${hour > 12 ? hour - 12 : hour} ${hour >= 12 ? 'PM' : 'AM'}`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Day columns */}
                        {weekDays.map((day) => (
                            <div key={day.toISOString()} className="flex-1 border-r border-gray-100 relative min-h-[1536px] group/col">
                                {/* Hour Slots */}
                                {HOURS.map((hour) => (
                                    <div
                                        key={hour}
                                        className="h-16 border-b border-gray-100/50 hover:bg-gray-50/40 transition-colors cursor-pointer relative"
                                        onClick={() => onSlotClick(day, hour)}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-primary/[0.02]">
                                            <span className="px-2 py-1 bg-white border border-primary/20 rounded shadow-sm text-[10px] font-bold text-primary">
                                                + Add Task
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Task Blocks */}
                                {tasks
                                    .filter((task) => isSameDay(new Date(task.startDate), day))
                                    .map((task) => {
                                        const style = getTaskStyle(task);
                                        return (
                                            <div
                                                key={task._id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onTaskClick(task);
                                                }}
                                                className={cn(
                                                    "absolute left-1 right-1 rounded-lg border p-2.5 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer z-10 group/task hover:z-20",
                                                    style.colorClasses
                                                )}
                                                style={{ top: style.top, height: style.height }}
                                            >
                                                <div className="flex flex-col h-full gap-0.5">
                                                    <p className="text-xs font-bold leading-tight truncate">
                                                        {task.title || '(No title)'}
                                                    </p>
                                                    <p className="text-[10px] font-medium opacity-80">
                                                        {format(new Date(task.startDate), 'h:mm a')}
                                                        {task.endDate && ` - ${format(new Date(task.endDate), 'h:mm a')}`}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
