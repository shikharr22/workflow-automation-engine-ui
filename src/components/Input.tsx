import React from "react";
import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
}

const Input = ({ label, className, ...props }: InputProps) => {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input
        {...props}
        className={clsx(
          "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-200",
          className
        )}
      />
    </div>
  );
};

export default Input;
