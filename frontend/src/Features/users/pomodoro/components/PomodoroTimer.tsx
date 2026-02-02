import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
    onSessionComplete: (duration: number, mode: TimerMode) => void;
    initialState?: {
        mode: TimerMode;
        timeLeft: number;
        isActive: boolean;
        lastUpdated: number | null;
    };
    onStateChange: (state: { mode: TimerMode; timeLeft: number; isActive: boolean; lastUpdated: number | null }) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete, initialState, onStateChange }) => {
    const [mode, setMode] = useState<TimerMode>(initialState?.mode || 'pomodoro');
    const [timeLeft, setTimeLeft] = useState(initialState?.timeLeft || 25 * 60);
    const [isActive, setIsActive] = useState(initialState?.isActive || false);
    
    // Recovery Logic: If active, account for time lost during reload/unmount
    useEffect(() => {
        if (initialState?.isActive && initialState?.lastUpdated) {
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - initialState.lastUpdated) / 1000);
            
            if (elapsedSeconds > 0) {
                const newTimeLeft = Math.max(0, initialState.timeLeft - elapsedSeconds);
                setTimeLeft(newTimeLeft);
                
                // If time already expired while away
                if (newTimeLeft === 0) {
                    // We can choose to autocomplete or just set to 0. 
                    // Let's set it to 0 and let the next effect handle completion?
                    // But isActive is true, so the interval effect will run and trigger completion immediately.
                }
            }
        }
    }, []);

    const [settings, setSettings] = useState({
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
        autoStartBreaks: true,
        autoStartPomodoros: false,
    });
    
    const [showSettings, setShowSettings] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const timerRef = useRef<NodeJS.Timeout>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Persist state changes
    useEffect(() => {
        onStateChange({
            mode,
            timeLeft,
            isActive,
            // Only update timestamp if active
            lastUpdated: isActive ? Date.now() : null
        });
    }, [mode, timeLeft, isActive]);

    // Initialize audio
    useEffect(() => {
        audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); // Simple bell sound
    }, []);

    const playSound = () => {
        if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(e => console.log('Audio play failed', e));
        }
    };

    const getDuration = (currentMode: TimerMode) => settings[currentMode] * 60;

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            // Timer finished
            handleTimerComplete();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        playSound();
        const duration = getDuration(mode);
        onSessionComplete(duration, mode);
        
        if (mode === 'pomodoro') {
            onSessionComplete(duration, mode);
            // Suggest break or auto-switch
             setMode('shortBreak');
             setTimeLeft(settings.shortBreak * 60);
             if (settings.autoStartBreaks) {
                 setIsActive(true);
             }
        } else {
             // Break over, back to work
             setMode('pomodoro');
             setTimeLeft(settings.pomodoro * 60);
             if (settings.autoStartPomodoros) {
                 setIsActive(true);
             }
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(getDuration(mode));
    };

    const changeMode = (newMode: TimerMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(settings[newMode] * 60);
    };

    const handleSettingChange = (key: keyof typeof settings, value: number | boolean) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        // If we're changing the time of the *current* mode, update timeLeft immediately if not active
        if (!isActive && key === mode) {
            setTimeLeft(Number(value) * 60);
        }
    };

    // Circular Progress Calculation
    const totalTime = getDuration(mode);
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const getColor = () => {
        switch (mode) {
            case 'pomodoro': return '#f87171'; // Classic Pomodoro Red
            case 'shortBreak': return '#00BCD4'; // Cyan
            case 'longBreak': return '#2196F3'; // Blue
            default: return '#f87171';
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 flex flex-col items-center relative overflow-hidden group">
             {/* Gradient Background Glow */}
             <div 
                className="absolute inset-0 transition-colors duration-500 pointer-events-none"
                style={{ backgroundColor: getColor(), opacity: 0.05 }}
            />

            {/* Mode Selectors */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 relative z-10 w-full justify-between">
                {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                    <button
                        key={m}
                        onClick={() => changeMode(m)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex-1 ${
                            mode === m 
                                ? 'bg-white text-gray-900 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-900'
                        }`}
                        style={{ color: mode === m ? getColor() : undefined }}
                    >
                        {m === 'pomodoro' ? 'Pomodoro' : m === 'shortBreak' ? 'Short Break' : 'Long Break'}
                    </button>
                ))}
            </div>

            {/* Main Timer Display */}
            <div className="relative mb-8">
                {/* SVG Circle */}
                <svg width="300" height="300" className="transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke="#F3F4F6"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        cx="150"
                        cy="150"
                        r={radius}
                        stroke={getColor()}
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset }}
                        initial={{ strokeDashoffset: circumference }}
                        transition={{ duration: 1, ease: "linear" }}
                        strokeLinecap="round"
                    />
                </svg>

                {/* Time Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl font-black text-gray-900 tracking-tighter tabular-nums">
                        {formatTime(timeLeft)}
                    </div>
                    <div className="text-gray-400 font-medium mt-2 uppercase tracking-widest text-xs">
                        {isActive ? 'Running' : 'Paused'}
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mb-6 z-10">
                <button
                    onClick={toggleTimer}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: getColor(), boxShadow: `0 10px 30px -10px ${getColor()}` }}
                >
                    {isActive ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
                </button>
                
                <button
                    onClick={resetTimer}
                    className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <RotateCcw size={20} />
                </button>
            </div>

            {/* Settings Toggle */}
            <div className="flex gap-2">
                 <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                    <Settings size={16} />
                    Settings
                </button>
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`flex items-center gap-2 transition-colors text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 ${soundEnabled ? 'text-[#E91E63]' : 'text-gray-400'}`}
                >
                    {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
            </div>


            {/* Settings Panel (Inline for simplicity) */}
            {showSettings && (
                <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="w-full bg-gray-50 rounded-xl p-4 mt-4 border border-gray-100"
                >
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Timer Settings (Minutes)</h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Focus</label>
                            <input 
                                type="number" 
                                value={settings.pomodoro}
                                onChange={(e) => handleSettingChange('pomodoro', Number(e.target.value))}
                                className="w-full rounded-lg border-gray-200 text-sm p-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Short Break</label>
                            <input 
                                type="number" 
                                value={settings.shortBreak}
                                onChange={(e) => handleSettingChange('shortBreak', Number(e.target.value))}
                                className="w-full rounded-lg border-gray-200 text-sm p-2 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Long Break</label>
                            <input 
                                type="number" 
                                value={settings.longBreak}
                                onChange={(e) => handleSettingChange('longBreak', Number(e.target.value))}
                                className="w-full rounded-lg border-gray-200 text-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default PomodoroTimer;
