// frontend/src/components/AvatarMenu.tsx
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const AvatarMenu: React.FC = () => {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:text-[#7F00FF]">
      <FaUserCircle size={28} />
      <span className="text-gray-700 font-medium">Profile</span>
    </div>
  );
};

export default AvatarMenu;
