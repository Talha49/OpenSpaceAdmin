import React from "react";
import { LuLoader } from "react-icons/lu";

const Loader = ({ size = 50 }) => {
  return (
    <div
      className={`h-screen w-full fixed top-0 left-0 z-50 backdrop-blur-sm flex items-center justify-center`}
    >
      <div
        className={`w-32 h-32 rounded-2xl border dark:border-none bg-white dark:bg-neutral-800 flex items-center justify-center`}
      >
        <LuLoader className="animate-spin" size={size} />
      </div>
    </div>
  );
};

export default Loader;
