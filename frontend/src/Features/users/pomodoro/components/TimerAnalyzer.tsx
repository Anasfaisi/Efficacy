import React from 'react';
import { BarChart3, Clock, Flame, Coffee } from 'lucide-react';

interface TimerAnalyzerProps {
    stats: {
        cycles: number;
        productiveTime: number; // in seconds
        shortBreaks: number;
        longBreaks: number;
        currentSessionCompleted: number;
    };
}

const TimerAnalyzer: React.FC<TimerAnalyzerProps> = ({ stats }) => {
    
    // Helpers to format time
    const formatProductiveTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 h-fit">
            <div className="text-center mb-8">
                <h3 className="text-gray-900 font-bold text-lg mb-1">Today's Summary</h3>
                <p className="text-sm font-medium text-gray-400">{getCurrentDate()}</p>
            </div>

            <div className="space-y-4">
                {/* Cycles */}
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                            <Flame size={20} />
                        </div>
                        <span className="font-bold text-gray-700">Pomodoro Cycles</span>
                    </div>
                    <span className="text-2xl font-black text-purple-600">{stats.cycles}</span>
                </div>

                {/* Productive Time */}
                <div className="flex items-center justify-between p-4 bg-pink-50 rounded-2xl border border-pink-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
                            <Clock size={20} />
                        </div>
                        <span className="font-bold text-gray-700">Productive Time</span>
                    </div>
                    <span className="text-2xl font-black text-pink-600">
                        {formatProductiveTime(stats.productiveTime)}
                    </span>
                </div>

                {/* Breaks Stats (Not explicitly tracked yet in passed props but placeholders for design) */}
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <Coffee size={20} />
                        </div>
                        <span className="font-bold text-gray-700">Short Breaks</span>
                    </div>
                    <span className="text-xl font-bold text-emerald-600">5m</span>
                </div>

                 <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <Coffee size={20} />
                        </div>
                        <span className="font-bold text-gray-700">Long Break</span>
                    </div>
                    <span className="text-xl font-bold text-blue-600">15m</span>
                </div>

                {/* Cycle Visualizer */}
                 <div className="mt-8 pt-8 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Current Session</span>
                        <span className="text-sm font-bold text-gray-900">{stats.currentSessionCompleted}/4</span>
                    </div>
                     <div className="flex gap-2 h-3">
                         {[1, 2, 3, 4].map((step) => (
                             <div 
                                key={step}
                                className={`flex-1 rounded-full transition-all duration-500 ${
                                    step <= stats.currentSessionCompleted
                                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-md shadow-pink-200'
                                        : 'bg-gray-100'
                                }`}
                             />
                         ))}
                     </div>
                 </div>

                 {/* Encouragement Button - Placeholder for functionality */}
                 <button className="w-full mt-6 btn-gradient py-4 rounded-xl text-white font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                    <BarChart3 size={20} />
                    View Detailed Report
                 </button>

            </div>
        </div>
    );
};

export default TimerAnalyzer;
