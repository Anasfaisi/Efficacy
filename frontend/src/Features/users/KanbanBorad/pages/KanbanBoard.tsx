// client/src/KanbanBoard/pages/KanbanBoard.tsx
import React from 'react';
import KanbanCard from '../components/KanbanCard';

const KanbanBoard: React.FC = () => {
  // Temporary sample data
  const columns = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: '1', title: 'Design Dashboard', description: 'Create UI for task dashboard' },
        { id: '2', title: 'Fix Login Issue', description: 'Resolve token expiration bug' },
      ],
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      tasks: [{ id: '3', title: 'Kanban Board UI', description: 'Implement card drag and drop' }],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [{ id: '4', title: 'Setup Project', description: 'Initialize React + Tailwind setup' }],
    },
  ];

  return (
    <div className="flex w-full bg-[#E8F1FF] rounded-xl shadow-inner p-6 gap-6 overflow-x-auto">
      {columns.map((col) => (
        <div key={col.id} className="flex flex-col bg-white/40 backdrop-blur-sm rounded-xl p-4 w-80 min-w-[300px]">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{col.title}</h2>

          <div className="flex flex-col gap-4">
            {col.tasks.map((task) => (
              <KanbanCard key={task.id} title={task.title} description={task.description} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
