import React from 'react';

interface ProfileInputProps {
  label: string;
  type?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  disabled?: boolean;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  readOnly,
}) => (
  <div className="flex flex-col gap-1 h-29">
    <label className="text-gray-700 text-sm font-medium h-10">{label}</label>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className="w-100% h-20 border border-purple-200 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300 transition-all"
    />
  </div>
);

export default ProfileInput;
