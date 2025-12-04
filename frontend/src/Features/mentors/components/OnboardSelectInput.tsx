interface SelectInputProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function SelectInput({ label, children, className, ...rest }: SelectInputProps) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-gray-700 font-medium">{label}</label>

      <select
        {...rest}
        className={`border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-sky-400 ${className}`}
      >
        {children}
      </select>
    </div>
  );
}
