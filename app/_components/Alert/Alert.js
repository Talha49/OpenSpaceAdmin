// components/Alert.js
import React from 'react';

const Alert = ({ message, type, onClose }) => {
  const alertClass =
    type === 'success'
      ? 'bg-green-500 text-white'
      : type === 'error'
      ? 'bg-red-500 text-white'
      : 'bg-neutral-500 text-white';

  return (
    <div className={`p-4 rounded-md ${alertClass} fixed top-4 left-1/2 transform -translate-x-1/2 z-50`}>
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white">
          X
        </button>
      </div>
    </div>
  );
};

export default Alert;
