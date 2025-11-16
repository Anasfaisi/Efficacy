import React, { useState } from 'react';
import Sidebar from '../../home/layouts/Sidebar';
import KanbanColumn from '../components/KanbanColumn';
import type { ColumnType } from '../types';
const intialColumns: ColumnType[] = [
  {
    id: 'todo',
    title: 'To Do',
    tasks: [
      {
        id: '1',
        title: 'Set up project',
        description: 'Create React + Vite + Tailwind base',
      },
      {
        id: '2',
        title: 'Design Kanban layout',
        description: 'Structure board, columns, cards',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    tasks: [{ id: '3', title: 'Build KanbanCard component' }],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [{ id: '4', title: 'Install dependencies' }],
  },
];

const KanbanBoard: React.FC = () => {
  const [columns] = useState<ColumnType[]>(intialColumns);
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <main className='min-h-screen bg-slate-50 px-6 py-8'>
        <h1 className='mb-6 text-2xl font-bold text-gray-900'>
          KanbanBoard
        </h1>

        <section className='flex gap-4 overflow-x-auto pb-4'>
          {columns.map((column)=>(
            <KanbanColumn key={column.id} column={column} />
          ))}
        </section>
      </main>
      </div>
  );
};

export default KanbanBoard;
