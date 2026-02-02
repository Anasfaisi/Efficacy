import React, { useEffect } from 'react';
import Sidebar from '../../home/layouts/Sidebar';
import Navbar from '../../home/layouts/Navbar';
import PomodoroTimer from '../components/PomodoroTimer';
import type { TimerMode } from '../components/PomodoroTimer';
import TimerAnalyzer from '../components/TimerAnalyzer';
import { Timer, BarChart3 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/redux/store';
import { updateSession, updateTimerState } from '@/redux/slices/pomodoroSlice';
import { logPomodoroSession } from '@/Services/pomodoro.api';

const PomodoroPage: React.FC = () => {
    const dispatch = useDispatch();
    
    // Select from Redux
    const { today, currentSessionCompleted, timerState } = useSelector((state: RootState) => state.pomodoro);

    const handleSessionComplete = async (duration: number, mode: TimerMode) => {
        // Update Redux stats
        dispatch(updateSession({ duration, type: mode }));

        // Log to Backend
        try {
            await logPomodoroSession({ duration, type: mode });
        } catch (error) {
            console.error('Failed to log pomodoro session:', error);
        }
    };

    const handleTimerStateChange = (state: { mode: TimerMode; timeLeft: number; isActive: boolean; lastUpdated: number | null }) => {
        dispatch(updateTimerState(state));
    };

    return (
        <div className="min-h-screen flex bg-white">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
                    {/* Header */}
                    <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Timer className="text-[#f87171]" />
                            Pomodoro Timer
                        </h1>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                            {/* Left Column: Timer */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <Timer className="text-[#f87171]" size={20} />
                                    Pomodoro Timer
                                </h2>
                                <PomodoroTimer 
                                    onSessionComplete={handleSessionComplete}
                                    initialState={timerState as any} // Cast safely as types match structure
                                    onStateChange={handleTimerStateChange}
                                />
                            </div>

                            {/* Right Column: Analyzer */}
                            <div className="flex flex-col gap-4">
                                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                    <BarChart3 className="text-[#2196F3]" size={20} />
                                    Timer Analyzer
                                </h2>
                                <TimerAnalyzer stats={{
                                    ...today,
                                    currentSessionCompleted: currentSessionCompleted
                                }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PomodoroPage;
