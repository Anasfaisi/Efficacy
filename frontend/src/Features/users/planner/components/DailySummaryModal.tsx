import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { format } from 'date-fns';
import type { IPlannerTask } from '../../planner/types';
import type { IPomodoroStats } from '@/Services/pomodoro.api';
import { getDailyPomodoroStats } from '@/Services/pomodoro.api';
import { CheckCircle2, Target, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface DailySummaryModalProps {
    date: Date;
    tasks: IPlannerTask[];
    isOpen: boolean;
    onClose: () => void;
    position: { x: number; y: number };
}

const DailySummaryModal: React.FC<DailySummaryModalProps> = ({ date, tasks, isOpen, onClose, position }) => {
    const [stats, setStats] = useState<IPomodoroStats | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchStats();
        }
    }, [isOpen, date]);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const dateStr = format(date, 'yyyy-MM-dd');
            const data = await getDailyPomodoroStats(dateStr);
            setStats(data);
        } catch (error) {
            console.error('Failed to fetch stats', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div 
            className="fixed inset-0 z-50 flex items-start justify-start" 
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, x: position.x, y: position.y }}
                animate={{ opacity: 1, scale: 1, x: Math.min(window.innerWidth - 350, Math.max(20, position.x)), y: Math.min(window.innerHeight - 400, Math.max(20, position.y)) }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-[320px] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
                style={{ position: 'absolute' }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{format(date, 'MMM d, yyyy')}</h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Daily Summary</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Pomodoro Stats */}
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10">
                            <Target size={60} />
                        </div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <Flame size={12} className="text-orange-500" /> Focus Metrics
                        </h4>
                        
                        {loading ? (
                            <div className="h-20 flex items-center justify-center text-xs text-gray-400">Loading stats...</div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-2xl font-black text-gray-900">{stats?.totalCycles || 0}</p>
                                    <p className="text-[10px] items-center text-gray-500 font-medium">Cycles</p>
                                </div>
                                <div>
                                     <p className="text-2xl font-black text-gray-900">
                                        {Math.floor((stats?.totalFocusTime || 0) / 60)}<span className="text-sm text-gray-400 font-normal">m</span>
                                    </p>
                                    <p className="text-[10px] text-gray-500 font-medium">Productive Time</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tasks List */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-green-500" /> Tasks
                        </h4>
                        <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                            {tasks.length > 0 ? tasks.map(task => (
                                <div key={task._id} className="flex items-start gap-2 text-sm p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${task.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={`${task.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                        {task.title}
                                    </span>
                                </div>
                            )) : (
                                <p className="text-xs text-gray-400 italic py-2 text-center">No tasks recorded for this day.</p>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>,
        document.body
    );
};

export default DailySummaryModal;
