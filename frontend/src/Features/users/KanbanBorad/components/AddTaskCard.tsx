import { CirclePlus } from 'lucide-react';
import React from 'react';
import type { AddTaskCardProps } from '../types';

const AddTaskCard: React.FC<AddTaskCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex justify-between p-4 border border-gray-400 shadow  rounded-lg bg-blue-50 hover:bg-blue-100 transition"
    >
      <div className="text-sm font-medium text-purple-800">Add Task</div>
      <CirclePlus color="#573965" />
    </div>
  );
};

export default AddTaskCard;
