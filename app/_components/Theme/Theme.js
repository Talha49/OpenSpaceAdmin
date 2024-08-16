// components/ThemeToggle.js
"use client"
import { toggleTheme } from '@/lib/Feature/ThemeSlice';
import { useDispatch, useSelector } from 'react-redux';


export default function ThemeToggle() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700"
    >
      {isDarkMode ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}



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