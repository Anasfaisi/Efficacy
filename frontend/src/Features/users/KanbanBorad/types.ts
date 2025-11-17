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
}
export interface KanbanColumnProps {
  column: ColumnType;
  addTask: (ColumnId: string, task: Task) => void;
  updateTask: (
    ColumnId: string,
    editingTaskId: string,
    data: Partial<Task>,
  ) => void;
}

export interface AddTaskCardProps {
  onClick: () => void;
}
