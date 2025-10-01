export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  category?: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: Date;
  type: 'study' | 'assignment' | 'meeting' | 'other';
}

export interface ProgressStats {
  timeLogged: string;
  hoursCompleted: string;
  currentStreak: number;
  weeklyGoal?: number;
  completedTasks: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: () => void;
}

export interface Collaboration {
  id: string;
  title: string;
  description: string;
  members: User[];
  type: 'study-group' | 'project' | 'discussion';
}

// Redux store shape (for reference)
export interface DashboardState {
  user: User;
  tasks: Task[];
  reminders: Reminder[];
  progress: ProgressStats;
  collaborations: Collaboration[];
  loading: boolean;
  error: string | null;
}
