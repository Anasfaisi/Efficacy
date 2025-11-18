import type { ReactNode } from 'react';

export interface Task {
  taskId: string;
  title: string;
  description?: string;
  dueDate?: string;
  approxTimeToFinish?: string;
}
export interface ColumnType {
  columnId: string;
  title: string;
  tasks: Task[];
}
export interface KanbanCardProps {
  task: Task;
  editTask: () => void;
  deleteTask: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}
export interface KanbanColumnProps {
  column: ColumnType;
  addTask: (ColumnId: string, task: Task) => void;
  updateTask: (
    ColumnId: string,
    editingTaskId: string,
    data: Partial<Task>,
  ) => void;
  deleteTask: (ColumnId: string, taskId: string) => void;
}

export interface KanbanBoardData {
  userId: string;
  columns: ColumnType[];
}

export interface AddTaskCardProps {
  onClick: () => void;
}

export interface SortableItemProps {
  id: string;
  children: (dragHandleProps: React.HTMLAttributes<HTMLElement>) => ReactNode;
}
