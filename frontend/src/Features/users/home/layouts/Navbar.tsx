// frontend/src/components/Navbar.tsx
import React from 'react';
import BellButton from '../components/BellButton';
import AvatarMenu from '../components/AvatarMenu';

const Navbar: React.FC = () => {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

      <div className="flex items-center gap-4">
        <BellButton />
        <AvatarMenu />
      </div>
    </div>
  );
};

export default Navbar;
