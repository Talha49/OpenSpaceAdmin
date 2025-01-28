'use client'

import { useSelector } from "react-redux";
import Sidebar from "./SideBar/SideBar";

export default function LayoutWrapper({ children }) {
  const { locked } = useSelector((state) => state.lock);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar className={`${locked ? 'w-64' : 'w-16'} fixed left-0 top-0 bg-neutral-200 dark:bg-neutral-900 z-40 shadow-lg`} />

      {/* Main Content */}
      <main className={`flex-1 ${locked ? 'ml-64' : 'ml-16'} p-4 dark:bg-neutral-950`}>
        {children}
      </main>
    </div>
  );
}