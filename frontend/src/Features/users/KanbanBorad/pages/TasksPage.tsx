import React, { useEffect, useState, useMemo } from 'react';
import { useAppSelector } from '@/redux/hooks';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import {
    getPlannerTasks,
    createPlannerTask,
    updatePlannerTask,
    deletePlannerTask,
} from '@/Services/planner.api';
import type { IPlannerTask } from '@/Features/users/planner/types';
import { Priority } from '@/Features/users/planner/types';
import TaskItem from '../components/TaskItem';
import TaskModal from '@/Features/users/planner/components/TaskModal';
import { ListTodo, Plus, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isToday, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

const TasksPage: React.FC = () => {
    const { currentUser } = useAppSelector((state) => state.auth);
    const [tasks, setTasks] = useState<IPlannerTask[]>([]);
    const [activeTab, setActiveTab] = useState<
        'All' | 'Today' | 'Upcoming' | 'Overdue'
    >('All');
    const [isAdding, setIsAdding] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<IPlannerTask | undefined>(
        undefined
    );
    const [currentPage, setCurrentPage] = useState(1);
    const TASKS_PER_PAGE = 6;

    useEffect(() => {
        if (currentUser) {
            fetchTasks();
        }
    }, [currentUser]);

    const fetchTasks = async () => {
        if (!currentUser?.id) return;
        try {
            const data = await getPlannerTasks();
            setTasks(data || []);
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    const filteredTasks = useMemo(() => {
        const now = new Date();
        const todayEnd = endOfDay(now);

        switch (activeTab) {
            case 'Today':
                return tasks.filter((t) => isToday(new Date(t.startDate)));
            case 'Upcoming':
                return tasks.filter((t) =>
                    isAfter(new Date(t.startDate), todayEnd)
                );
            case 'Overdue':
                return tasks.filter(
                    (t) => !t.completed && isBefore(new Date(t.endDate), now)
                );
            default:
                return tasks;
        }
    }, [tasks, activeTab]);

    const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
    const paginatedTasks = useMemo(() => {
        const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
        return filteredTasks.slice(startIndex, startIndex + TASKS_PER_PAGE);
    }, [filteredTasks, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab]);

    const completedCount = tasks.filter((t) => t.completed).length;
    const totalCount = tasks.length;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const handleToggleComplete = async (
        taskId: string,
        currentStatus: boolean
    ) => {
        if (!currentUser?.id) return;
        try {
            const updatedTask = await updatePlannerTask(taskId, {
                completed: !currentStatus,
            });
            setTasks((prev) =>
                prev.map((t) => (t._id === taskId ? updatedTask : t))
            );
        } catch (error) {
            console.error('Failed to update task', error);
        }
    };

    const handleDelete = async (taskId: string) => {
        if (!currentUser?.id) return;
        try {
            await deletePlannerTask(taskId);
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
        } catch (error) {
            console.error('Failed to delete task', error);
        }
    };

    const handleAddTask = async () => {
        if (!currentUser?.id) return;

        if (!isAdding) {
            setIsAdding(true);
            return;
        }

        if (newTaskTitle.trim().length < 5) {
            setTitleError('Title must be at least 5 characters');
            return;
        }

        // Default time: start of current hour to one hour later
        const start = new Date();
        start.setMinutes(0, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + 1);

        const newTask: Partial<IPlannerTask> = {
            title: newTaskTitle.trim(),
            priority: Priority.MEDIUM,
            completed: false,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            subtasks: [],
        };

        try {
            const createdTask = await createPlannerTask(newTask);
            setTasks((prev) => [createdTask, ...prev]);
            setIsAdding(false);
            setNewTaskTitle('');
            setTitleError('');
        } catch (error) {
            console.error('Failed to add task', error);
        }
    };

    const cancelAdding = () => {
        setIsAdding(false);
        setNewTaskTitle('');
        setTitleError('');
    };

    const handleOpenAddModal = () => {
        setSelectedTask(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (task: IPlannerTask) => {
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <div className="flex-1 bg-gray-50 overflow-y-auto custom-scrollbar relative">
                    <div className="p-8 pt-6 max-w-6xl mx-auto pb-60">
                        {/* Header */}
                        <div className="flex flex-col gap-8 mb-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-primary rounded-3xl shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                                        <ListTodo className="text-white w-7 h-7" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                                            Tasks
                                        </h1>
                                        <p className="text-sm font-bold text-gray-400">
                                            Organize your flow with Efficacy
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm p-1.5 rounded-[1.25rem] border border-gray-200 shadow-sm">
                                    <div className="flex border-r border-gray-100 pr-1.5 mr-1.5">
                                        {(
                                            [
                                                'All',
                                                'Today',
                                                'Upcoming',
                                                'Overdue',
                                            ] as const
                                        ).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() =>
                                                    setActiveTab(tab)
                                                }
                                                className={cn(
                                                    'px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all',
                                                    activeTab === tab
                                                        ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                                )}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleOpenAddModal}
                                        className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        <Plus size={18} strokeWidth={3} />
                                    </button>
                                </div>
                            </div>

                            {/* Table Header labels */}
                            <div className="grid grid-cols-[6px_40px_1fr_140px_200px_240px] gap-8 px-8 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <div />
                                <div className="text-center">Status</div>
                                <div>Task Description</div>
                                <div>Target Date</div>
                                <div>Time Analysis</div>
                                <div className="text-right pr-4">Actions</div>
                            </div>
                        </div>

                        {/* Task List */}
                        <div className="space-y-4">
                            {isAdding && (
                                <div className="bg-white p-4 rounded-2xl border-2 border-primary/20 shadow-xl shadow-primary/5 animate-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1">
                                            <input
                                                autoFocus
                                                type="text"
                                                placeholder="What needs to be done?"
                                                className={cn(
                                                    'w-full bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 placeholder:text-gray-400',
                                                    titleError &&
                                                        'ring-2 ring-rose-500/20'
                                                )}
                                                value={newTaskTitle}
                                                onChange={(e) => {
                                                    setNewTaskTitle(
                                                        e.target.value
                                                    );
                                                    if (
                                                        e.target.value.length >=
                                                        5
                                                    )
                                                        setTitleError('');
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter')
                                                        handleAddTask();
                                                    if (e.key === 'Escape')
                                                        cancelAdding();
                                                }}
                                            />
                                            {titleError && (
                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-2 ml-1">
                                                    {titleError}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={handleAddTask}
                                                className="bg-primary text-white p-3 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                            >
                                                <Check
                                                    size={20}
                                                    strokeWidth={3}
                                                />
                                            </button>
                                            <button
                                                onClick={cancelAdding}
                                                className="bg-gray-100 text-gray-400 p-3 rounded-xl hover:bg-gray-200 transition-all"
                                            >
                                                <X size={20} strokeWidth={3} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {paginatedTasks.length > 0 ? (
                                paginatedTasks.map((task) => (
                                    <TaskItem
                                        key={task._id}
                                        task={task}
                                        onToggleComplete={() =>
                                            handleToggleComplete(
                                                task._id,
                                                task.completed
                                            )
                                        }
                                        onDelete={() => handleDelete(task._id)}
                                        onEdit={() => handleEdit(task)}
                                    />
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                        <ListTodo className="text-gray-200 w-12 h-12" />
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                        No tasks in your queue
                                    </p>
                                    <button
                                        onClick={handleAddTask}
                                        className="mt-6 text-primary font-black text-sm hover:underline"
                                    >
                                        Create your first task
                                    </button>
                                </div>
                            )}

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-8">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl text-xs font-black transition-all",
                                                    currentPage === page
                                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                        : "bg-white text-gray-400 border border-gray-100 hover:border-primary/20 hover:text-primary"
                                                )}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-400 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Stats & Actions */}
                    <div className="sticky bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc]/80 to-transparent pointer-events-none z-30">
                        <div className="max-w-6xl mx-auto flex flex-col items-center gap-8 pointer-events-auto">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_-20px_60px_-15px_rgba(127,0,255,0.15)] border border-gray-100 w-full max-w-xl">
                                <div className="flex justify-between items-center mb-5">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        Productivity Score:{' '}
                                        <span className="text-gray-900 ml-2">
                                            {completedCount}/{totalCount}{' '}
                                            Completed
                                        </span>
                                    </span>
                                    <span className="text-xs font-black text-primary">
                                        {Math.round(progress)}% Efficiency
                                    </span>
                                </div>
                                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden p-1">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(127,0,255,0.4)]"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <button className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-primary transition-colors">
                                    View History
                                </button>
                                <button
                                    onClick={handleOpenAddModal}
                                    className="bg-orange-500 text-white px-12 py-5 rounded-2xl font-black shadow-2xl shadow-orange-500/40 hover:bg-orange-600 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 group"
                                >
                                    <Plus
                                        size={22}
                                        strokeWidth={3}
                                        className="group-hover:rotate-90 transition-transform"
                                    />
                                    <span className="uppercase tracking-widest text-xs">
                                        Unleash Next Task
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* <FloatingTimer /> */}
                </div>
            </div>

            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={selectedTask}
                    onSave={fetchTasks}
                />
            )}
        </div>
    );
};

export default TasksPage;
