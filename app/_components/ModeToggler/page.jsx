"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { FaMoon } from "react-icons/fa";
import { IoMdSunny } from "react-icons/io";
import { WiDayStormShowers } from "react-icons/wi";

const ModeToggler = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to toggle dropdown

  // Ensures the component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        className="p-2 rounded-lg border border-neutral-300 shadow-lg bg-white hover:bg-yellow-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-600 transition-all duration-200 ease-in-out"
        onClick={toggleDropdown}
      >
        {theme === "dark" && <FaMoon className="h-6 w-6 text-blue-200" />}
        {theme === "light" && <IoMdSunny className="h-6 w-6 text-yellow-500" />}
        {theme === "system" && (
          <WiDayStormShowers className="h-6 w-6 text-blue-500" />
        )}
      </button>

      <div
        className={`absolute right-0  mt-2 p-1 w-36 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 shadow-xl rounded-lg z-10 transform transition-all duration-200 ease-in-out origin-top-right ${
          isOpen
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="py-1 text-sm text-neutral-700 dark:text-neutral-300">
          <li
            onClick={() => {
              setTheme("light");
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            <IoMdSunny className=" text-yellow-500" />
            <span>Light</span>
          </li>
          <li
            onClick={() => {
              setTheme("dark");
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            <FaMoon className=" text-blue-200" />
            <span>Dark</span>
          </li>
          <li
            onClick={() => {
              setTheme("system");
              setIsOpen(false);
            }}
            className="flex items-center space-x-2 px-4 py-2 cursor-pointer rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200"
          >
            <WiDayStormShowers className=" text-blue-500" />
            <span>System</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ModeToggler;
