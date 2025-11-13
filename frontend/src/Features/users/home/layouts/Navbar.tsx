// frontend/src/components/Navbar.tsx
import React from 'react';
import BellButton from '../components/BellButton';
import AvatarMenu from '../components/AvatarMenu';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-4">
        <BellButton />
        <AvatarMenu />
        <Link
          to="/logout"
          className="
            bg-purple-600 
            text-white 
            px-4 
            py-2 
            rounded-lg 
            hover:bg-purple-700 
            transition-colors
          "
        >
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
