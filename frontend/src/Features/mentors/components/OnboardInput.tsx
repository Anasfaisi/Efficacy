interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...rest }: InputProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700 font-medium">{label}</label>

      {/* 👇 THIS is the important part */}
      <input
        {...rest}
        className={`border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none  ${className}`}
      />
    </div>
  );
}
