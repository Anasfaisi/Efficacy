// frontend/src/components/Sidebar.tsx
import React from 'react';
import { FaCommentDots, FaCreditCard } from 'react-icons/fa';
import SidebarButton from '../components/SidebarButton';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-6 py-4 text-2xl font-bold text-[#7F00FF]">
        Efficacy
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
        <SidebarButton
          icon={<FaCreditCard />}
          label="Kanban Board"
          to="/kanbanBoard"
          colorClass="hover:bg-[#00897B]"
        />
        <SidebarButton
          icon={<FaCommentDots />}
          label="Chat Room"
          to="/chat"
          colorClass="hover:bg-[#7F00FF]"
        />
        <SidebarButton
          icon={<FaCreditCard />}
          label="Subscription"
          to="/subscription"
          colorClass="hover:bg-[#00897B]"
        />
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 mt-auto text-sm text-gray-500">
        © 2025 Efficacy
      </div>
    </div>
  );
};

export default Sidebar;
