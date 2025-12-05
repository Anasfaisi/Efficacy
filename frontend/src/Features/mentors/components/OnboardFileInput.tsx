import React from 'react';

type FileInputProps = {
  label?: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FileInput({
  label,
  name,
  className,
  onChange,
  ...rest
}: FileInputProps) {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-gray-700 font-medium">{label}</label>}
      <input
        type="file"
        name={name}
        {...rest}
        onChange={onChange}
        className={`border border-gray-300 bg-gray-50 rounded-lg p-2 cursor-pointer ${className ?? ''}`}
      />
    </div>
  );
}
