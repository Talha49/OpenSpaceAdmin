// components/ThemeWrapper.js
"use client"
import { useSelector } from 'react-redux';

export default function ThemeWrapper({ children }) {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);
  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen`}>
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white">
        {children}
      </div>
    </div>
  );
}