// src/components/profile/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import ProfileInput from './ProfileInput';
import ProfilePic from './ProfilePic';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateProfile } from '@/Services/user.api';
import { setCredentials } from '@/redux/slices/authSlice';

const ProfileForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const user = currentUser?.role === 'user' ? currentUser : null;
    const [editMode, setEditMode] = useState<boolean>(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        userId: '',
        headline: '',
        bio: '',
        xpPoints: 0,
        league: '',
        currentStreak: 0,
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                userId: user.userId || '',
                email: user.email || '',
                headline: user.headline || '',
                bio: user.bio || '',
                xpPoints: user.xpPoints || 0,
                league: user.league || '',
                currentStreak: user.currentStreak || 0,
            });
        }
    }, [user]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!user || !form) return;
            const result = await updateProfile(form, user.id);

            setEditMode(false);
            if (result) {
                dispatch(setCredentials({ currentUser: result.data }));
            }
        } catch (err) {
            console.error('Profile update failed:', err);
        }
    };

    return (
        <form
            onSubmit={handleSave}
            className="bg-white p-8 rounded-2xl shadow-lg border border-purple-100  "
        >
            <h2 className="text-xl font-semibold text-purple-700 text-center mb-6">
                {editMode ? 'Edit Your Profile ✏️' : 'Your Profile 🎯'}
            </h2>

            <ProfilePic />

            <div className="flex flex-col  gap-4">
                <ProfileInput
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    readOnly={!editMode}
                />
                <ProfileInput
                    label="userId"
                    name="userId"
                    value={form.userId ? form.userId : form.name + '356'}
                    onChange={handleChange}
                    readOnly
                />
                <ProfileInput
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    readOnly
                />
                <ProfileInput
                    label="headline"
                    name="headline"
                    value={form.headline}
                    onChange={handleChange}
                    placeholder="who are you , your designation ,ambition "
                    readOnly={!editMode}
                />
                <ProfileInput
                    label="Bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    placeholder="tell me about you"
                    readOnly={!editMode}
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
                {editMode ? (
                    <>
                        <button
                            type="button"
                            onClick={() => setEditMode(false)}
                            className="w-1/2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-1/2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                        >
                            Save Changes
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={() => setEditMode(true)}
                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                    >
                        Edit Profile
                    </button>
                )}
            </div>
        </form>
    );
};

export default ProfileForm;
