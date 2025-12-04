import React from 'react';

type FileInputProps = {
  label?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FileInput({ label, className, ...rest }:FileInputProps) {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-gray-700 font-medium">{label}</label>}
      <input
        type="file"
        {...rest} // <-- RHF's onChange, onBlur, ref, name all work!
        className={`border border-gray-300 bg-gray-50 rounded-lg p-2 cursor-pointer ${className ?? ''}`}
      />
    </div>
  );
}
