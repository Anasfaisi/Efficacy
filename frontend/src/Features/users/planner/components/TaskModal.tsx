import React, { useState, useEffect } from 'react';
import type { IPlannerTask, ISubtask } from '../types';
import { Priority } from '../types';
import { X, Plus, Trash2, CheckCircle2, Circle, Calendar, Clock, BarChart } from 'lucide-react';
import { createPlannerTask, updatePlannerTask, deletePlannerTask } from '@/Services/planner.api';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    task?: IPlannerTask;
    onSave: () => void;
    initialData?: {
        date: string;
        startTime: string;
    };
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, task, onSave, initialData }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<Priority>(Priority.LOW);
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [startTime, setStartTime] = useState(format(new Date(), 'HH:mm'));
    const [endTime, setEndTime] = useState(format(new Date(Date.now() + 60 * 60 * 1000), 'HH:mm'));
    const [subtasks, setSubtasks] = useState<Partial<ISubtask>[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setPriority(task.priority);
            setDate(format(parseISO(task.startDate), 'yyyy-MM-dd'));
            setStartTime(format(parseISO(task.startDate), 'HH:mm'));
            setEndTime(format(parseISO(task.endDate), 'HH:mm'));
            setSubtasks(task.subtasks);
            setIsCompleted(task.completed);
        } else if (initialData) {
            setTitle('');
            setDescription('');
            setPriority(Priority.LOW);
            setDate(initialData.date);
            setStartTime(initialData.startTime);
            const [h, m] = initialData.startTime.split(':').map(Number);
            const endH = (h + 1) % 24;
            setEndTime(`${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
            setSubtasks([]);
            setIsCompleted(false);
        } else {
            setTitle('');
            setDescription('');
            setPriority(Priority.LOW);
            setDate(format(new Date(), 'yyyy-MM-dd'));
            setStartTime(format(new Date(), 'HH:mm'));
            setEndTime(format(new Date(Date.now() + 60 * 60 * 1000), 'HH:mm'));
            setSubtasks([]);
            setIsCompleted(false);
        }
    }, [task, isOpen]);

    const handleSave = async () => {
        if (!title.trim()) {
            toast.error('Please enter a task title');
            return;
        }

        try {
            setIsSaving(true);
            const startDate = new Date(`${date}T${startTime}`).toISOString();
            const endDate = new Date(`${date}T${endTime}`).toISOString();

            const taskData: Partial<IPlannerTask> = {
                title,
                description,
                priority,
                startDate,
                endDate,
                subtasks: subtasks as ISubtask[],
                completed: isCompleted,
            };

            if (task) {
                await updatePlannerTask(task._id, taskData);
                toast.success('Task updated successfully');
            } else {
                await createPlannerTask(taskData);
                toast.success('Task created successfully');
            }
            onSave();
            onClose();
        } catch (error) {
            console.error('Failed to save task:', error);
            toast.error('Failed to save task');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!task) return;
        if (!confirm('Are you sure you want to delete this task?')) return;

        try {
            await deletePlannerTask(task._id);
            toast.success('Task deleted successfully');
            onSave();
            onClose();
        } catch (error) {
            toast.error('Failed to delete task');
        }
    };

    const addSubtask = () => {
        setSubtasks([...subtasks, { title: '', completed: false }]);
    };

    const updateSubtask = (index: number, data: Partial<ISubtask>) => {
        const newSubtasks = [...subtasks];
        newSubtasks[index] = { ...newSubtasks[index], ...data };
        setSubtasks(newSubtasks);
    };

    const removeSubtask = (index: number) => {
        setSubtasks(subtasks.filter((_, i) => i !== index));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
                    <h2 className="text-xl font-bold text-gray-900">{task ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Task Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 font-semibold placeholder:text-gray-300"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add details..."
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-900 resize-none placeholder:text-gray-300"
                        />
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <Calendar size={12} /> Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                <Clock size={12} /> Time Range <span className="text-[8px] font-bold text-primary/50 normal-case">(1h default)</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                />
                                <span className="text-gray-400 text-xs font-bold">to</span>
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                    className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                            <BarChart size={12} /> Priority
                        </label>
                        <div className="flex gap-2">
                            {[Priority.LOW, Priority.MEDIUM, Priority.HIGH].map((p) => {
                                const colors = {
                                    [Priority.LOW]: 'bg-green-50 text-green-600 border-green-100 active:bg-green-100',
                                    [Priority.MEDIUM]: 'bg-yellow-50 text-yellow-600 border-yellow-100 active:bg-yellow-100',
                                    [Priority.HIGH]: 'bg-pink-50 text-pink-600 border-pink-100 active:bg-pink-100',
                                };
                                return (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={cn(
                                            "flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all transform active:scale-95",
                                            priority === p ? colors[p] + " border-current shadow-sm" : "bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100"
                                        )}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Subtasks */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Subtasks</label>
                            <button
                                onClick={addSubtask}
                                className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1"
                            >
                                <Plus size={14} /> Add subtask
                            </button>
                        </div>
                        <div className="space-y-2">
                            {subtasks.map((st, index) => (
                                <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-xl border border-gray-100">
                                    <button
                                        onClick={() => updateSubtask(index, { completed: !st.completed })}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        {st.completed ? <CheckCircle2 size={18} className="text-green-500" /> : <Circle size={18} />}
                                    </button>
                                    <input
                                        type="text"
                                        value={st.title}
                                        onChange={(e) => updateSubtask(index, { title: e.target.value })}
                                        placeholder="Subtask description..."
                                        className={cn(
                                            "flex-1 bg-transparent outline-none text-sm transition-all",
                                            st.completed && "line-through text-gray-400"
                                        )}
                                    />
                                    <button onClick={() => removeSubtask(index)} className="text-gray-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {subtasks.length === 0 && (
                                <p className="text-xs text-gray-400 italic text-center py-2">No subtasks yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div>
                        {task && (
                            <button
                                onClick={handleDelete}
                                className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn-gradient px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {isSaving ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
