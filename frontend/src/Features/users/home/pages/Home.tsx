import React from 'react';
import Sidebar from '../layouts/Sidebar';
import Navbar from '../layouts/Navbar';
import KanbanBoard from '../../KanbanBorad/pages/KanbanBoard';

const Home: React.FC = () => {
  // const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="min-h-screen flex bg-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        {}

        <div className="flex-1 bg-gray-50 overflow-y-auto p-6">
          <KanbanBoard />
        </div>
      </div>
    </div>
  );
};

export default Home;
