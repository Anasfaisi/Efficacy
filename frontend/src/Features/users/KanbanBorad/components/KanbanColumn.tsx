import React from 'react';
import type { ColumnType, KanbanColumnProps, Task } from '../types';
import KanbanCard from './KanbanCard';

const KanbanColumn: React.FC<KanbanColumnProps> = ({ column }) => {
  return (
    <div className="flex flex-col rounded-xl bg-purple-50 p-4 w-72 max-h[80vh] overflow-y-auto border border-purple-100">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-purple-900">{column?.title}</h3>
        <span className="text-xs text-purpel-500">{column.tasks.length}</span>
      </header>

      {column.tasks.map((task: Task) => (
        <KanbanCard
          key={task.id}
          task={{
            id: 'first',
            title: 'Nothing',
            description: 'Testing card render',
            dueDate: '1 day',
          }}
        />
      ))}
    </div>
  );
};

export default KanbanColumn;
