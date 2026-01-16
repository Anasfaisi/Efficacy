import React from 'react';
import { Hourglass, CheckCircle2, Circle, Trash2, Pencil, Calendar } from 'lucide-react';
import type { IPlannerTask } from '@/Features/users/planner/types';
import { Priority } from '@/Features/users/planner/types';
import { cn } from '@/lib/utils';
import { format, differenceInHours } from 'date-fns';
import { Link } from 'react-router-dom';

interface TaskItemProps {
    task: IPlannerTask;
    onToggleComplete: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onEdit, onDelete }) => {
    const getPriorityStyles = (priority: Priority) => {
        switch (priority) {
            case Priority.HIGH:
                return 'border-rose-200 bg-rose-50/30';
            case Priority.MEDIUM:
                return 'border-amber-200 bg-amber-50/30';
            case Priority.LOW:
                return 'border-emerald-200 bg-emerald-50/30';
            default:
                return 'border-gray-200 bg-white';
        }
    };

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case Priority.HIGH: return 'bg-rose-500';
            case Priority.MEDIUM: return 'bg-amber-500';
            case Priority.LOW: return 'bg-emerald-500';
            default: return 'bg-gray-400';
        }
    };

    const duration = differenceInHours(new Date(task.endDate), new Date(task.startDate));

    return (
        <div className={cn(
            "group relative grid grid-cols-[6px_40px_1fr_140px_200px_240px] gap-8 items-center p-4 mb-3 rounded-2xl border transition-all hover:shadow-md bg-white",
            getPriorityStyles(task.priority),
            task.completed && "opacity-60 bg-gray-50/50 grayscale-[0.5]"
        )}>
            {/* Priority Indicator */}
            <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: getPriorityColor(task.priority) }} />

            {/* Status Checkbox */}
            <button 
                onClick={onToggleComplete}
                className="flex justify-center transition-transform active:scale-90"
            >
                {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary fill-primary/10" />
                ) : (
                    <Circle className="w-6 h-6 text-gray-300 hover:text-primary transition-colors" />
                )}
            </button>

            {/* Task Details */}
            <div className="min-w-0">
                <h3 className={cn(
                    "text-base font-bold text-gray-900 truncate",
                    task.completed && "line-through text-gray-500"
                )}>
                    {task.title || '(No title)'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {task.description || 'No description'}
                </p>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 border border-white/20 whitespace-nowrap overflow-hidden">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-600 truncate">
                    {task.startDate ? format(new Date(task.startDate), 'MMM dd, yyyy') : 'No date'}
                </span>
            </div>

            {/* Time Analyzer */}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-xl bg-white/50 border border-white/20">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Hourglass className="w-4 h-4 text-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-gray-700">{duration > 0 ? `${duration}h` : '< 1h'}</span>
                </div>
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: task.completed ? '100%' : '30%' }} />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1">
                <button 
                    onClick={onEdit}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-primary transition-all"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button 
                    onClick={onDelete}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-rose-500 transition-all"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                <Link 
                    to="/planner"
                    className="ml-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20 transition-all shadow-sm hover:-translate-y-0.5 whitespace-nowrap"
                >
                    View in Planner
                </Link>
            </div>
        </div>
    );
};

export default TaskItem;
