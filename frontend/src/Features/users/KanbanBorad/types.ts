export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  approxTimetofinish?: string;
}
export interface ColumnType {
  id: string;
  title: string;
  tasks: Task[];
}
export interface KanbanCardProps {
  task: Task;
}
export interface KanbanColumnProps{
    column:ColumnType
}
