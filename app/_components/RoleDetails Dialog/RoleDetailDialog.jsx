import React from "react";

const RoleDetailDialog = ({ isOpen, onClose, children, role }) => {

    console.log("Role =>", role)
  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed top-0 left-0 h-screen w-full bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`fixed top-0 right-0 h-screen md:w-1/2 w-full z-50 transition-transform duration-300 bg-white dark:bg-stone-950 border-l dark:border-neutral-700 shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="h-full p-4">{children}</div>
      </div>
    </>
  );
};

export default RoleDetailDialog;
