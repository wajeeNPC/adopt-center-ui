import React from 'react';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';

const Toast = ({ message, type }) => {
  if (!message) return null;

  const config = {
    success: {
      bgColor: 'bg-green-500',
      icon: CheckCircle
    },
    info: {
      bgColor: 'bg-blue-500',
      icon: Info
    },
    error: {
      bgColor: 'bg-red-500',
      icon: AlertCircle
    }
  };

  const { bgColor, icon: Icon } = config[type] || config.success;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`}>
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;