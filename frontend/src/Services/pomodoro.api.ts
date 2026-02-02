import api from './axiosConfig';

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

export const logPomodoroSession = async (data: { duration: number; type: string }) => {
    const response = await api.post('/pomodoro/log', data);
    return response.data;
};

export const getDailyPomodoroStats = async (date: string): Promise<IPomodoroStats> => {
    const response = await api.get(`/pomodoro/stats?date=${date}`);
    return response.data;
};
