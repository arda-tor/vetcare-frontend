import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  id?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, fullWidth = true, className = '', ...props }, ref) => {
    const inputId = id || props.name;
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            block rounded-md border-neutral-300 shadow-sm
            focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50
            disabled:bg-neutral-100 disabled:text-neutral-500
            ${error ? 'border-red-500' : 'border-neutral-300'}
            ${fullWidth ? 'w-full' : ''}
            px-4 py-2
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;