import React from "react";
import { IoMdClose } from "react-icons/io";

const ConfirmationDialog = ({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  actionButtons,
}) => {
  return (
    <>
      {/* Background Overlay */}
      <div
        className={`flex justify-center items-center fixed top-0 left-0 h-screen w-full bg-black bg-opacity-60 z-40 transition-opacity duration-300 p-4 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`h-fit md:w-1/2 w-full z-50 transition-transform duration-300 bg-white dark:bg-neutral-800 border dark:border-neutral-700 shadow-lg rounded-2xl p-4 ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent event propagation
        >
          {/* Close Button */}
          <button
            className="absolute top-2 right-3 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
          {/* Modal Content */}
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="mt-4 flex justify-end items-center gap-2 flex-wrap">
            <button
              className="flex items-center gap-1 py-2 px-4 rounded-lg text-sm border dark:border-neutral-600 bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all"
              onClick={onClose}
            >
              <IoMdClose className="text-base" />
              Cancel
            </button>
            {actionButtons}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmationDialog;
