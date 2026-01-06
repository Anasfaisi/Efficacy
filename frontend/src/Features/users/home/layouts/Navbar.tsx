import React from 'react';
import BellButton from '../components/BellButton';
import AvatarMenu from '../components/AvatarMenu';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <div className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-8 relative z-10">
            <div className="flex-1" />

            <h1 className="text-2xl font-black text-[#7F00FF] tracking-tight drop-shadow-sm">
                Your Dashboard
            </h1>

            <div className="flex-1 flex items-center justify-end gap-6">
                <div className="p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                    <BellButton />
                </div>
                <div className="p-1 border-2 border-[#7F00FF]/20 rounded-2xl hover:border-[#7F00FF]/50 transition-all cursor-pointer">
                    <AvatarMenu />
                </div>
                <Link
                    to="/logout"
                    className="
            border-2 border-[#7F00FF]
            text-[#7F00FF]
            px-6 
            py-1.5
            rounded-xl
            font-black
            text-sm
            hover:bg-[#7F00FF] 
            hover:text-white
            transition-all
            shadow-lg shadow-transparent hover:shadow-[#7F00FF]/20
            active:scale-95
          "
                >
                    Log Out
                </Link>
            </div>
        </div>
    );
};

export default Navbar;
