// frontend/src/components/SidebarButton.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
  colorClass?: string;
  onClick?: () => void;
  to?: string; // for navigation
}

const SidebarButton: React.FC<SidebarButtonProps> = ({ icon, label, colorClass = 'hover:bg-[#7F00FF]', onClick, to }) => {
  const baseClass = `flex items-center gap-3 px-4 py-2 text-gray-700 rounded-lg ${colorClass} hover:text-white transition`;

  if (to) {
    return (
      <Link to={to} className={baseClass}>
        {icon}
        {label}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {icon}
      {label}
    </button>
  );
};

export default SidebarButton;
