import React, { useState, useMemo } from 'react';
import type { IPlannerTask } from '../types';
import { Priority } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    format,
    isSameDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    addDays,
    addWeeks,
    addMonths,
    subDays,
    subWeeks,
    subMonths,
    isSameMonth,
    isToday,
    startOfDay,
    differenceInMinutes,
} from 'date-fns';

interface CalendarViewProps {
    tasks: IPlannerTask[];
    onTaskClick: (task: IPlannerTask) => void;
    onSlotClick: (date: Date, hour: number) => void;
    onDayContextMenu: (date: Date, e: React.MouseEvent) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarView: React.FC<CalendarViewProps> = ({
    tasks,
    onTaskClick,
    onSlotClick,
    onDayContextMenu,
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'day' | 'week' | 'month'>('week');

    const daysToRender = useMemo(() => {
        let start: Date;
        let end: Date;

        switch (view) {
            case 'day':
                start = startOfDay(currentDate);
                end = start;
                break;
            case 'week':
                start = startOfWeek(currentDate);
                end = endOfWeek(currentDate);
                break;
            case 'month':
                const monthStart = startOfMonth(currentDate);
                const monthEnd = endOfMonth(currentDate);
                start = startOfWeek(monthStart);
                end = endOfWeek(monthEnd);
                break;
        }

        return eachDayOfInterval({ start, end });
    }, [currentDate, view]);

    const handlePrev = () => {
        switch (view) {
            case 'day':
                setCurrentDate(subDays(currentDate, 1));
                break;
            case 'week':
                setCurrentDate(subWeeks(currentDate, 1));
                break;
            case 'month':
                setCurrentDate(subMonths(currentDate, 1));
                break;
        }
    };

    const handleNext = () => {
        switch (view) {
            case 'day':
                setCurrentDate(addDays(currentDate, 1));
                break;
            case 'week':
                setCurrentDate(addWeeks(currentDate, 1));
                break;
            case 'month':
                setCurrentDate(addMonths(currentDate, 1));
                break;
        }
    };

    const handleToday = () => setCurrentDate(new Date());

    const getTaskStyle = (task: IPlannerTask) => {
        const start = new Date(task.startDate);
        const end = new Date(task.endDate);
        
        // Calculate position based on time for Day/Week view
        const startHour = start.getHours() + start.getMinutes() / 60;
        const durationInMinutes = differenceInMinutes(end, start);
        const durationInHours = durationInMinutes / 60;
        
        const top = `${startHour * 64}px`; // 64px per hour
        const height = `${Math.max(durationInHours * 64, 28)}px`; // Minimum height

        let colorClasses =
            'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20';
        if (task.priority === Priority.HIGH)
            colorClasses =
                'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100';
        else if (task.priority === Priority.MEDIUM)
            colorClasses =
                'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100';
        else if (task.priority === Priority.LOW)
            colorClasses =
                'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100';

        if (task.completed) {
            colorClasses =
                'bg-gray-50 border-gray-100 text-gray-400 line-through decoration-gray-400';
        }

        return { top, height, colorClasses };
    };

    // Helper to get logic for Month View task display
    const getMonthViewTaskStyle = (task: IPlannerTask) => {
        let colorClasses = 'bg-primary/10 text-primary';
        if (task.priority === Priority.HIGH) colorClasses = 'bg-rose-100 text-rose-800';
        else if (task.priority === Priority.MEDIUM) colorClasses = 'bg-amber-100 text-amber-800';
        else if (task.priority === Priority.LOW) colorClasses = 'bg-emerald-100 text-emerald-800';
        
        if (task.completed) colorClasses = 'bg-gray-100 text-gray-500 line-through';
        
        return colorClasses;
    }

    const renderTimeGridView = () => (
        <div className="flex-1 overflow-auto custom-scrollbar relative bg-white">
            <div className="min-w-[800px] relative">
                {/* Header (Dates) */}
                <div className="sticky top-0 z-20 flex bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
                     <div className="w-20 flex-shrink-0 border-r border-gray-100 flex items-end justify-end pb-2 pr-2">
                        <span className="text-[10px] font-bold text-gray-400">
                             GMT{format(new Date(), 'x')}
                        </span>
                    </div>
                    {daysToRender.map((day) => {
                         const today = isToday(day);
                        return (
                            <div
                                key={day.toISOString()}
                                className="flex-1 border-r border-gray-100 py-4 flex flex-col items-center justify-center min-w-[120px]"
                            >
                                <p className={cn(
                                    "text-xs font-semibold uppercase tracking-wider mb-1",
                                    today ? "text-primary" : "text-gray-500"
                                )}>
                                    {format(day, 'EEE')}
                                </p>
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-all",
                                    today ? "bg-primary text-white shadow-md shadow-primary/30" : "text-gray-900"
                                )}>
                                    {format(day, 'd')}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Body (Time grid) */}
                <div className="flex relative">
                    {/* Time labels */}
                     <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-white z-10">
                        {HOURS.map((hour) => (
                            <div key={hour} className="h-16 relative">
                                <span className="absolute -top-3 right-2 text-xs font-medium text-gray-400">
                                    {hour === 0 ? '' : format(new Date().setHours(hour), 'h a')}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Columns */}
                    {daysToRender.map((day) => (
                        <div
                            key={day.toISOString()}
                             className="flex-1 border-r border-gray-100 relative min-w-[120px] bg-white"
                        >
                             {/* Grid Lines */}
                             {HOURS.map((hour) => (
                                <div
                                    key={hour}
                                    className="h-16 border-b border-gray-100 hover:bg-gray-50/50 transition-colors group cursor-pointer"
                                     onClick={() => onSlotClick(day, hour)}
                                />
                             ))}

                            {/* Tasks */}
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
                                                'absolute left-1 right-1 rounded-md border p-2 shadow-sm cursor-pointer overflow-hidden transition-all hover:shadow-md hover:z-30 z-10',
                                                style.colorClasses
                                            )}
                                            style={{
                                                top: style.top,
                                                height: style.height,
                                            }}
                                        >
                                            <div className="flex flex-col h-full">
                                                <span className="text-xs font-bold leading-tight line-clamp-1">
                                                     {task.title || '(No title)'}
                                                </span>
                                                 <span className="text-[10px] font-medium opacity-80 mt-0.5">
                                                     {format(new Date(task.startDate), 'h:mm a')}
                                                 </span>
                                            </div>
                                        </div>
                                    );
                                })}

                             {/* Current Time Indicator logic could go here */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderMonthView = () => (
        <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
             {/* Days Header */}
            <div className="flex border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                    <div key={dayName} className="flex-1 py-2 text-center text-sm font-semibold text-gray-400 uppercase tracking-widest">
                        {dayName}
                    </div>
                ))}
            </div>
            
            {/* Grid */}
            <div className="flex-1 grid grid-cols-7 grid-rows-5 auto-rows-fr">
                {daysToRender.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isDayToday = isToday(day);
                    const dayTasks = tasks.filter(t => isSameDay(new Date(t.startDate), day));
                    
                    return (
                        <div
                            key={day.toISOString()}
                            className={cn(
                                "border-b border-r border-gray-100 min-h-[120px] p-2 flex flex-col transition-colors hover:bg-gray-50/30",
                                !isCurrentMonth && "bg-gray-50/50 text-gray-400"
                            )}
                            onClick={() => onSlotClick(day, 9)} // Default to 9am on click
                            onContextMenu={(e) => onDayContextMenu(day, e)}
                        >
                            <div className="flex items-center justify-center mb-1">
                                 <span className={cn(
                                     "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full",
                                     isDayToday ? "bg-primary text-white" : "text-gray-700"
                                 )}>
                                     {format(day, 'd')}
                                 </span>
                            </div>

                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar-hidden">
                                {dayTasks.map(task => (
                                    <div
                                        key={task._id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onTaskClick(task);
                                        }}
                                        className={cn(
                                            "text-[10px] px-1.5 py-1 rounded truncate font-medium cursor-pointer transition-opacity hover:opacity-80",
                                            getMonthViewTaskStyle(task)
                                        )}
                                        title={task.title}
                                    >
                                        <span className="opacity-75 mr-1 text-[9px]">
                                            {format(new Date(task.startDate), 'HH:mm')}
                                        </span>
                                        {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="h-full flex flex-col bg-white select-none">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-[0_1px_3px_rgb(0,0,0,0.02)] z-30">
                <div className="flex items-center gap-6">
                     <div className="flex items-center gap-2">
                         <span className="text-2xl font-bold text-gray-900 tracking-tight">
                            {format(currentDate, 'MMMM')}
                        </span>
                        <span className="text-2xl font-light text-gray-500">
                             {format(currentDate, 'yyyy')}
                        </span>
                     </div>
                     
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-md p-0.5 shadow-sm">
                        <button
                            onClick={handlePrev}
                            className="p-1.5 hover:bg-gray-50 rounded text-gray-600 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleToday}
                             className="px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={handleNext}
                            className="p-1.5 hover:bg-gray-50 rounded text-gray-600 transition-colors"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex bg-gray-100/80 p-1 rounded-lg border border-gray-200/50">
                    {(['day', 'week', 'month'] as const).map((v) => (
                        <button
                            key={v}
                            onClick={() => setView(v)}
                            className={cn(
                                'px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all duration-200',
                                view === v
                                    ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            )}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
             {view === 'month' ? renderMonthView() : renderTimeGridView()}
        </div>
    );
};

export default CalendarView;

