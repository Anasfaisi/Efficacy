import React from 'react'

interface KanbanCardProps {
  title: string;
  description?: string;
}
export const KanbanCard: React.FC<KanbanCardProps> = ({ title, description }) => {
  return (
    <div
      className="
        bg-white 
        shadow-md 
        rounded-2xl 
        p-4 
        cursor-grab 
        active:cursor-grabbing 
        border border-transparent 
        hover:border-purple-500 
        transition-all
      "
    >
      <h3 className="text-base font-semibold text-gray-800 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-600 leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}

export default KanbanCard