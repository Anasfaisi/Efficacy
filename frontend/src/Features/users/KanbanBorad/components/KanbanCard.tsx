import React, { useState } from 'react';
import type { KanbanCardProps } from '../types';

const KanbanCard: React.FC<KanbanCardProps> = ({ task }) => {
  return (
    <div className="mb-3 rounded-lg border border-purple-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <h4 className='text-sm font-semibold text-gray-800'>{task.title}</h4>
      {task.description && (<p className='mt-1 text-xs text-gray-500'>{task.description}</p>)}
    </div>
  );
};

export default KanbanCard;
