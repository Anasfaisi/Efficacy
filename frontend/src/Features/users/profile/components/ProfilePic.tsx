import React, { useState } from 'react';
// import Sidebar from '../../home/layouts/Sidebar';
import { FaUserCircle } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import type { RootState } from '@/redux/store';
import { updateProfilePicture } from '@/Services/user.api';
import { setCredentials } from '@/redux/slices/authSlice';

const ProfilePic: React.FC = () => {
  const dispatch = useAppDispatch();
  const [proPic, setProPic] = useState<File | null>(null);
  const user = useAppSelector((state: RootState) => state.auth.currentUser);

  const [editState, setEditState] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) setProPic(file);
  };

  const handleProfilePicUpdate = async () => {
    if (!proPic) return;
    const result = await updateProfilePicture(proPic, 'user', user?.id);
    console.log(result, 'propic');
    if (result?.user) {
      dispatch(setCredentials({ currentUser: result.user }));
      setEditState(false);
    } else {
      console.error('Unexpected API response:', result);
    }
  };

  const handleCancel = () => {
    setProPic(null);
  };
  return (
    <>
      <div className="flex flex-col items-center mb-6">
        <div className="">
          <span className="text-purple-600 opacity-80">
            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                width={100}
                height={100}
                style={{
                  borderRadius: '50%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <FaUserCircle size={60} />
            )}
          </span>
        </div>
        <button
          className="bg-purple-600 opacity-80 text-white rounded-5 w-35 h-8 m-5"
          onClick={() => setEditState(true)}
        >
          {user?.profilePic ? 'Change picture' : 'Add picture'}
        </button>
        {editState && (
          <div>
            <input
              type="file"
              accept="image/*"
              name="image"
              onChange={handleFileChange}
              className="cursor-pointer opacity-80 mt-3  border-3 bg-indigo-700 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition"
            />
            {proPic && (
              <>
                <button
                  disabled={!proPic}
                  className="cursor-pointer opacity-80 mt-3  border-3 bg-indigo-900 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-900 transition"
                  onClick={handleProfilePicUpdate}
                >
                  update
                </button>
                <button
                  onClick={handleCancel}
                  className="cursor-pointer opacity-80 mt-3  border-3 bg-indigo-900 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-900 transition"
                >
                  cancel
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePic;
