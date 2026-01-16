import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FloatingTimer: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [seconds, setSeconds] = useState(5445); // 01:30:45 from image
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return {
            h: h.toString().padStart(2, '0'),
            m: m.toString().padStart(2, '0'),
            s: s.toString().padStart(2, '0')
        };
    };

    const time = formatTime(seconds);

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50"
            >
                <TimerIcon size={24} />
            </button>
        );
    }

    return (
        <div className="fixed bottom-8 right-8 bg-white rounded-[2rem] p-6 shadow-2xl border border-gray-100 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300 min-w-[240px]">
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
                <X size={16} />
            </button>

            <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Focus Timer</span>
                
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-gray-900 tabular-nums">{time.h}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">Hrs</span>
                    </div>
                    <span className="text-2xl font-black text-gray-300">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-gray-900 tabular-nums">{time.m}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">Min</span>
                    </div>
                    <span className="text-2xl font-black text-gray-300">:</span>
                    <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-gray-900 tabular-nums">{time.s}</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase mt-1">Sec</span>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full">
                    <button 
                        onClick={() => setIsActive(!isActive)}
                        className={cn(
                            "flex-1 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 shadow-lg",
                            isActive 
                                ? "bg-amber-100 text-amber-600 shadow-amber-200/50" 
                                : "bg-primary text-white shadow-primary/30"
                        )}
                    >
                        {isActive ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                    </button>
                    <button 
                        onClick={() => { setSeconds(0); setIsActive(false); }}
                        className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all active:rotate-[-90deg]"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FloatingTimer;
