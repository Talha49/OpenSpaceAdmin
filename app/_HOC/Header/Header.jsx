"use client";
import React from "react";
import Link from "next/link";
import { FaFilter, FaSearch, FaEllipsisH } from "react-icons/fa";
import { BsMoon } from "react-icons/bs";

const Header = ({
  title,
  subTitle,
  buttons,
  searchTerm,
  onSearchChange,
  onFilterClick,
  onBulkDelete,
  onRefresh,
  mode,
  actionMode
  
}) => {
  return (
    <div className="bg-white p-4">
      {/* Top section with site title and dark mode toggle */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm">
          Dark mode <BsMoon className="w-5 h-5 text-sm" />
        </button>
      </div>

      {/* Section title */}
      <h1 className="font-semibold text-xl mb-4">{subTitle}</h1>

      {/* Action buttons and search/filter */}
      <div className="flex items-center justify-between border-t-2 pt-4">
        {/* Action buttons */}
        <div className="flex items-center gap-3">
          {buttons?.map((btn, index) => (
            <div key={index} className="relative flex items-center gap-1 group">
              {btn.link ? (
                <Link href={btn.link} className="flex items-center hover:text-blue-600">
                  {btn.icon && <btn.icon className="w-4 h-4 text-blue-500" />} {/* Ensure btn.icon exists */}
                  <span className="hidden lg:inline text-[10px]">{btn.text}</span>
                </Link>
              ) : (
                <button className="flex items-center hover:text-blue-600" onClick={btn.onClick}>
                  {btn.icon && <btn.icon className="w-4 h-4 text-blue-500" />} {/* Ensure btn.icon exists */}
                  <span className="hidden lg:inline text-[10px]">{btn.text}</span>
                </button>
              )}
              {btn.text && (
                <div
                  className="absolute bottom-full mb-1 hidden text-xs text-white bg-gray-800 p-1 rounded-lg shadow-md group-hover:block lg:hidden"
                  style={{ whiteSpace: "nowrap", zIndex: 1000 }}
                >
                  {btn.text}
                </div>
              )}
            </div>
          ))}
        </div>

        {mode && (
          <button
            onClick={onBulkDelete}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            {actionMode}
          </button>
        )}

        <div className="flex items-center gap-2">
          <button
            className="relative flex items-center gap-1 px-3 py-2 text-sm font-medium"
            onClick={onFilterClick}
          >
            <FaFilter className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users list"
              onChange={onSearchChange}
              value={searchTerm}
              className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
