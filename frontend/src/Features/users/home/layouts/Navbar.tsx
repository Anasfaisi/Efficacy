import React from 'react';
import BellButton from '../components/BellButton';
import AvatarMenu from '../components/AvatarMenu';
import {} from 'react-router-dom';

const Navbar: React.FC = () => {
    return (
        <div className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-8 relative z-10 w-full shrink-0">
            <div className="flex items-center gap-3">
                <img
                    src="/Title logo.png"
                    alt="Efficacy Logo"
                    className="w-10 h-10 rounded-xl object-cover shadow-sm"
                />
                <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
                    Efficacy<span className="text-[#7F00FF]">.</span>
                </h1>
            </div>

            <div className="flex items-center justify-end gap-6">
                <div className="p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                    <BellButton />
                </div>
                <div className="p-1 border-2 border-[#7F00FF]/20 rounded-2xl hover:border-[#7F00FF]/50 transition-all cursor-pointer">
                    <AvatarMenu />
                </div>
            </div>
        </div>
    );
};

export default Navbar;
