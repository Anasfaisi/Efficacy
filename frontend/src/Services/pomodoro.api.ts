import type { IPomodoroStats } from '@/types/pomodoro';
import api from './axiosConfig';
import { PomodoroRoutes } from './constant.routes';



export const logPomodoroSession = async (data: {
    duration: number;
    type: string;
}) => {
    const response = await api.post(PomodoroRoutes.LOG_SESSION, data);
    return response.data;
};

export const getDailyPomodoroStats = async (
    date: string
): Promise<IPomodoroStats> => {
    const response = await api.get(PomodoroRoutes.GET_STATS,{
        params:{
            date
        }
    });
    return response.data;
};
