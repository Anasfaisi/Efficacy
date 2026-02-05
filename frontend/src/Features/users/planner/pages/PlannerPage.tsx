import React, { useState, useEffect } from 'react';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import CalendarView from '../components/CalendarView';
import type { IPlannerTask } from '../types';
import { getPlannerTasks } from '@/Services/planner.api';
import TaskModal from '@/Features/users/planner/components/TaskModal';
import DailySummaryModal from '../components/DailySummaryModal';
import { Plus } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';

const PlannerPage: React.FC = () => {
    const [tasks, setTasks] = useState<IPlannerTask[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<IPlannerTask | undefined>(
        undefined
    );
    const [initialData, setInitialData] = useState<
        { date: string; startTime: string } | undefined
    >(undefined);

    // Summary Context Menu State
    const [summaryModalOpen, setSummaryModalOpen] = useState(false);
    const [selectedDateForSummary, setSelectedDateForSummary] = useState<Date | null>(null);
    const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

    const fetchTasks = async () => {
        try {
            const data = await getPlannerTasks();
            setTasks(data);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        }
    };

    useEffect(() => {
        fetchTasks();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                handleAddTask();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleAddTask = () => {
        setSelectedTask(undefined);
        setInitialData(undefined);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: IPlannerTask) => {
        setSelectedTask(task);
        setInitialData(undefined);
        setIsModalOpen(true);
    };

    const handleSlotClick = (date: Date, hour: number) => {
        setSelectedTask(undefined);
        setInitialData({
            date: format(date, 'yyyy-MM-dd'),
            startTime: `${hour.toString().padStart(2, '0')}:00`,
        });
        setIsModalOpen(true);
    };

    const handleDayContextMenu = (date: Date, e: React.MouseEvent) => {
        e.preventDefault(); // Override browser right click
        setSelectedDateForSummary(date);
        setContextMenuPos({ x: e.clientX, y: e.clientY });
        setSummaryModalOpen(true);
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <div className="flex-1 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Planner
                        </h1>
                        <button
                            onClick={handleAddTask}
                            className="btn-gradient px-4 py-2 rounded-xl flex items-center gap-2 font-semibold shadow-lg shadow-primary/20 group relative"
                        >
                            <Plus size={20} />
                            Add Task
                            <span className="absolute -bottom-6 right-0 text-[8px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Shortcut: Alt + T
                            </span>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden relative">
                        <CalendarView
                            tasks={tasks}
                            onTaskClick={handleEditTask}
                            onSlotClick={handleSlotClick}
                            onDayContextMenu={handleDayContextMenu}
                        />
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    task={selectedTask}
                    onSave={fetchTasks}
                    initialData={initialData}
                />
            )}

            {summaryModalOpen && selectedDateForSummary && (
                <DailySummaryModal
                    date={selectedDateForSummary}
                    tasks={tasks.filter(task => {
                        const taskStart = new Date(task.startDate);
                        const taskEnd = new Date(task.endDate);
                        const dayStart = startOfDay(selectedDateForSummary);
                        const dayEnd = addDays(dayStart, 1);
                        return taskStart < dayEnd && taskEnd > dayStart;
                    })}
                    isOpen={summaryModalOpen}
                    onClose={() => setSummaryModalOpen(false)}
                    position={contextMenuPos}
                />
            )}
        </div>
    );
};

export default PlannerPage;
