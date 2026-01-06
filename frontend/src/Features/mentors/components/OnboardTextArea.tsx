import React from 'react';

type TextareaProps = {
    label?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
    label,
    id,
    className = '',
    ...rest
}: TextareaProps) {
    const textareaId =
        id ?? `textarea-${Math.random().toString(36).slice(2, 9)}`;

    return (
        <div className="flex flex-col space-y-1">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="text-gray-700 font-medium"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`border border-gray-300 rounded-lg p-3 h-28 resize-none focus:ring-2 focus:ring-sky-400 focus:outline-none ${className}`}
                {...rest}
            />
        </div>
    );
}
