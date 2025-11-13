// src/pages/ProfileSetupPage.tsx
import React from 'react';
import ProfileForm from '../components/profileForm';
import Sidebar from '../../home/layouts/Sidebar';

const ProfileSetupPage: React.FC = () => {
  return (
    
    <div className='flex min-h-screen bg-gray-50'>
      <div className="w-64 bg-white shadow-md">
      <Sidebar />
      </div>
    
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex-1 p-6">
      <ProfileForm />
    </div>
    </div>
  );
};

export default ProfileSetupPage;
