import React from 'react';

const BellButton: React.FC = () => {
  return (
    <button className="relative text-gray-600 hover:text-[#7F00FF]">
      🔔
      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
    </button>
  );
};

export default BellButton;
