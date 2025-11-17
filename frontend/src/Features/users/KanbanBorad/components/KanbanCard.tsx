import { GripVertical, Pencil, Trash2 } from 'lucide-react';
import type { KanbanCardProps } from '../types';

const KanbanCard: React.FC<KanbanCardProps> = ({
  task,
  editTask,
  deleteTask,
  dragHandleProps,
}) => {
  return (
    <div className="mb-3 rounded-lg border border-purple-200 bg-white p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between">
        <button
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          onClick={(e) => e.stopPropagation()} // IMPORTANT
        >
          <GripVertical size={16} className="mr-1" />
        </button>
        <h4 className="text-sm font-semibold text-gray-800">{task.title}</h4>
        <div className="flex items-center">
          <Pencil
            size={15}
            className="mr-2 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
               editTask();
            }}
          />
          <Trash2
            size={15}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              deleteTask()
            }}
          />
        </div>
      </div>
      <div>
        {task.description && (
          <p className="mt-1 text-xs text-gray-500">{task.description}</p>
        )}
        {task.dueDate && (
          <p className="mt-1 text-xs text-gray-500">{task.dueDate}</p>
        )}
        {task.approxTimeToFinish && (
          <p className="mt-1 text-xs text-gray-500">
            {task.approxTimeToFinish}
          </p>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
