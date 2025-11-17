import React, { useState } from 'react';
import Sidebar from '../../home/layouts/Sidebar';
import KanbanColumn from '../components/KanbanColumn';
import type { ColumnType, Task } from '../types';

const initialColumns: ColumnType[] = [
  {
    columnId: 'todo',
    title: 'To Do',
    tasks: [
      {
        taskId: '1',
        title: 'Set up project',
        description: 'Create React + Vite + Tailwind base',
      },
      {
        taskId: '2',
        title: 'Design Kanban layout',
        description: 'Structure board, columns, cards',
      },
    ],
  },
  {
    columnId: 'in-progress',
    title: 'In Progress',
    tasks: [{ taskId: '3', title: 'Build KanbanCard component' }],
  },
  {
    columnId: 'done',
    title: 'Done',
    tasks: [{ taskId: '4', title: 'Install dependencies' }],
  },
];

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<ColumnType[]>(initialColumns);
  const addtask = (columnId: string, task: Task) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.columnId === columnId
          ? { ...col, tasks: [...col.tasks, task] }
          : col,
      ),
    );
    console.log(columns);
  };

  const updateTask = (
    columnId: string,
    taskId: string,
    data: Partial<Task>,
  ) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.columnId === columnId
          ? {
              ...col,
              tasks: col.tasks.map((task) =>
                task.taskId === taskId ? { ...task, ...data } : task,
              ),
            }
          : col,
      ),
    );
  };
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">KanbanBoard</h1>

        <section className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.columnId}
              column={column}
              addTask={addtask}
              updateTask={updateTask}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default KanbanBoard;
