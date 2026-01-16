export enum Priority {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low',
}

export interface ISubtask {
    _id?: string;
    title: string;
    completed: boolean;
}

export interface IPlannerTask {
    _id: string;
    userId: string;
    title: string;
    description?: string;
    priority: Priority;
    startDate: string;
    endDate: string;
    subtasks: ISubtask[];
    completed: boolean;
    createdAt: string;
    updatedAt: string;
}
