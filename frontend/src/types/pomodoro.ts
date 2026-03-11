export interface IPomodoroStats {
    date: string;
    totalFocusTime: number;
    totalCycles: number;
    sessions: Array<{
        startTime: Date;
        endTime: Date;
        duration: number;
        type: 'pomodoro' | 'shortBreak' | 'longBreak';
    }>;
}
