import React, { useState } from 'react';
// import Sidebar from '../../home/layouts/Sidebar';
import KanbanColumn from '../components/KanbanColumn';
import type { ColumnType, Task } from '../types';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

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
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    let sourceColIndex = -1;
    let sourceTaskIndex = -1;

    columns.forEach((col, ci) => {
      const ti = col.tasks.findIndex((task) => task.taskId === activeId);
      if (ti !== -1) {
        sourceColIndex = ci;
        sourceTaskIndex = ti;
      }
    });

    let destColIndex = -1;
    let destTaskIndex = -1;

    columns.forEach((col, ci) => {
      const ti = col.tasks.findIndex((task) => task.taskId === overId);
      if (ti !== -1) {
        destColIndex = ci;
        destTaskIndex = ti;
      }
    });

    if (sourceColIndex === -1 || destColIndex === -1) return;

    const sourceColumn = columns[sourceColIndex];
    const destColumn = columns[destColIndex];

    if (sourceColIndex === destColIndex) {
      const newTasks = arrayMove(
        sourceColumn.tasks,
        sourceTaskIndex,
        destTaskIndex,
      );

      setColumns((cols) =>
        cols.map((col, i) =>
          i === sourceColIndex ? { ...col, tasks: newTasks } : col,
        ),
      );
      return;
    }

    const movingTask = sourceColumn.tasks[sourceTaskIndex];

    const newSourceTasks = [...sourceColumn.tasks];
    newSourceTasks.splice(sourceTaskIndex, 1);

    const newDestTasks = [...destColumn.tasks];
    newDestTasks.splice(destTaskIndex, 0, movingTask);

    setColumns((cols) =>
      cols.map((col, i) => {
        if (i === sourceColIndex) return { ...col, tasks: newSourceTasks };
        if (i === destColIndex) return { ...col, tasks: newDestTasks };
        return col;
      }),
    );
  };

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

  const deleteTask = (ColumnId: string, taskId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.columnId === ColumnId
          ? {
              ...col,
              tasks: col.tasks.filter((task) => task.taskId !== taskId),
            }
          : col,
      ),
    );
  };
  return (
    <div className="flex h-screen gap-4 p-4">
      {/* <Sidebar /> */}
      <main className="min-h-screen bg-slate-50 px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">KanbanBoard</h1>
        <DndContext onDragEnd={handleDragEnd}>
          <section className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.columnId}
                column={column}
                addTask={addtask}
                updateTask={updateTask}
                deleteTask={deleteTask}
              />
            ))}
          </section>
        </DndContext>
      </main>
    </div>
  );
};

export default KanbanBoard;
