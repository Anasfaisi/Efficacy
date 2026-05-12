export interface UserStatsEntity {
    id: string;
    userId: string;
    taskStreakDays: number;
    tasksCompleted: number;
    pomodorosCompleted: number;
    focusMinutes: number;
    sessionsCompleted: number;
    lastActivityDate: Date;
    createdAt?: Date;
    updatedAt?: Date;
}
