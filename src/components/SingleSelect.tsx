import React from "react";
import clsx from "clsx";

interface SelectDropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  className?: string;
}

const SingleSelect = ({
  label,
  options,
  className,
  ...props
}: SelectDropdownProps) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="text-sm text-white">{label}</label>}
      <select
        {...props}
        className={clsx(
          "w-full px-3 py-2 rounded-md border border-gray-700 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out",
          className
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SingleSelect;
