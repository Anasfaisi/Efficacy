// src/components/profile/ProfileSelect.tsx
import React from 'react';

interface ProfileSelectProps {
    label: string;
    name: string;
    options: string[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ProfileSelect: React.FC<ProfileSelectProps> = ({
    label,
    name,
    options,
    value,
    onChange,
}) => (
    <div className="flex flex-col gap-1">
        <label className="text-gray-700 text-sm font-medium">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className="border border-purple-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 transition-all"
        >
            <option value="">Select...</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

export default ProfileSelect;
