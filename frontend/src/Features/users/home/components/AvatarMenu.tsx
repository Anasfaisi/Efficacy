import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { useAppSelector } from '@/redux/hooks';
import type { Mentor } from '@/types/auth';

const AvatarMenu: React.FC = () => {
  let  { currentUser } = useAppSelector((state) => state.auth);
  currentUser = currentUser as Mentor;
  const profilePath = currentUser?.role === 'mentor' ? '/mentor/profile' : '/profile';

  return (
    <div className="flex items-center gap-2 cursor-pointer hover:text-[#7F00FF] transition-colors">
      <Link to={profilePath} className="flex items-center gap-2 text-gray-700 font-medium">
        {currentUser?.profilePic ? (
          <img 
            src={currentUser.profilePic} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-gray-200 object-cover" 
          />
        ) : (
          <FaUserCircle size={28} className="text-gray-400" />
        )}
        <span>Profile</span>
      </Link>
    </div>
  );
};

export default AvatarMenu;
