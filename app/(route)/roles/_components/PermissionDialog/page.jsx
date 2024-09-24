import React from "react";

const PermissionDialog = ({ children, onClose, classes }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 md:p-10 transition-opacity duration-300 ease-in-out">
      {/* Dialog Box */}
      <div
        className={`relative bg-white rounded-lg shadow-lg w-full max-w-full min-h-[500px] max-h-[500px] overflow-y-auto mx-auto p-4 ${classes}`}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
          onClick={onClose}
        >
          &#x2715; {/* Unicode for "X" */}
        </button>

        {/* Dialog Content */}
        {children}

        {/* Action Buttons */}
        <div className="flex justify-end mt-2 gap-2 ">
          <button
            className="px-4 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-all"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionDialog;
