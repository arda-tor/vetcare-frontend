import React from 'react';
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from 'lucide-react';
import { AlertProps } from '../../types';

const Alert: React.FC<AlertProps & { onClose?: () => void }> = ({
  type,
  message,
  onClose,
}) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-300',
    error: 'bg-red-50 text-red-800 border-red-300',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-300',
    info: 'bg-blue-50 text-blue-800 border-blue-300',
  };

  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  };

  return (
    <div className={`rounded-md border p-4 ${styles[type]} mb-4`} role="alert">
      <div className="flex items-start">
        <div className={`mr-3 flex-shrink-0 ${iconStyles[type]}`}>{icons[type]}</div>
        <div className="flex-1">{message}</div>
        {onClose && (
          <button
            type="button"
            className="ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            onClick={onClose}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;