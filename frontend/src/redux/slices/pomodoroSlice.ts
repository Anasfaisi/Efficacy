import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface DayStats {
    date: string; // ISO date string (YYYY-MM-DD)
    cycles: number;
    productiveTime: number; // in seconds
    shortBreaks: number; // count
    longBreaks: number; // count
}

interface PomodoroState {
    today: DayStats;
    currentSessionCompleted: number; // 0-4
    timerState: {
        mode: 'pomodoro' | 'shortBreak' | 'longBreak';
        timeLeft: number;
        isActive: boolean;
        lastUpdated: number | null; // Timestamp to calculate elapsed time
    };
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

const initialState: PomodoroState = {
    today: {
        date: getTodayDate(),
        cycles: 0,
        productiveTime: 0,
        shortBreaks: 0,
        longBreaks: 0,
    },
    currentSessionCompleted: 0,
    timerState: {
        mode: 'pomodoro',
        timeLeft: 25 * 60,
        isActive: false,
        lastUpdated: null,
    },
};

const pomodoroSlice = createSlice({
    name: 'pomodoro',
    initialState,
    reducers: {
        updateSession: (state, action: PayloadAction<{ duration: number; type: 'pomodoro' | 'shortBreak' | 'longBreak' }>) => {
            const todayDate = getTodayDate();
            
            // Reset if it's a new day
            if (state.today.date !== todayDate) {
                state.today = {
                    date: todayDate,
                    cycles: 0,
                    productiveTime: 0,
                    shortBreaks: 0,
                    longBreaks: 0,
                };
                state.currentSessionCompleted = 0;
            }

            const { duration, type } = action.payload;

            if (type === 'pomodoro') {
                state.today.productiveTime += duration;
                state.today.cycles += 1;
                state.currentSessionCompleted = (state.currentSessionCompleted + 1) % 4;
            } else if (type === 'shortBreak') {
                state.today.shortBreaks += 1;
            } else if (type === 'longBreak') {
                state.today.longBreaks += 1;
            }
        },
        resetStats: (state) => {
             const todayDate = getTodayDate();
             state.today = {
                date: todayDate,
                cycles: 0,
                productiveTime: 0,
                shortBreaks: 0,
                longBreaks: 0,
            };
            state.currentSessionCompleted = 0;
        },
        updateTimerState: (state, action: PayloadAction<Partial<PomodoroState['timerState']>>) => {
            state.timerState = { ...state.timerState, ...action.payload };
        }
    },
});

export const { updateSession, resetStats, updateTimerState } = pomodoroSlice.actions;
export default pomodoroSlice.reducer;
