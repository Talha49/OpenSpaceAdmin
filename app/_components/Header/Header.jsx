"use client";
import React, { useState } from "react";
import { GiSpaceShuttle } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import ModeToggler from "../ModeToggler/page";

const Header = () => {
  const [showDialog, setShowDialog] = useState(false);

  const handleDialog = () => {
    setShowDialog(!showDialog);
  };

  return (
    <div className="flex w-full justify-between leading-[60px] border-b dark:border-neutral-800 px-8 bg-white dark:bg-neutral-950 text-black dark:text-white sticky top-0 z-10 cursor-pointer">
      <div className="flex gap-2 items-center">
        <div>
          <GiSpaceShuttle className="md:text-[35px] sm:text-sm text-blue-400" />
        </div>
        <div className="md:text-[16px] sm:text-[12px]">OpenSpace - Admin</div>
      </div>
      <div className="flex items-center gap-2 relative">
        {/* <ModeToggler /> */}
        <p>
          <FaQuestion />
        </p>
        <div className="bg-slate-400 rounded-full p-1" onClick={handleDialog}>
          <Image
            src="/images/avatar.png"
            width={35}
            height={35}
            alt="Profile"
          />
        </div>

        {/* Dropdown with transition */}
        <div
          className={`absolute top-16 right-0 w-[340px] bg-neutral-50 dark:bg-neutral-800 shadow-lg border dark:border-neutral-700 rounded-xl p-2 transition-all duration-300 ease-in-out transform ${
            showDialog
              ? "opacity-100 scale-100 z-10"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <Image
              src="/images/avatar.png"
              width={70}
              height={70}
              alt="Profile"
              className="rounded-full border-2 border-blue-500 dark:border-blue-400"
            />
            <p className="font-semibold leading-tight text-neutral-900 dark:text-white text-lg">
              Muhammad Saleem
            </p>
            <p className="text-gray-500 leading-tight dark:text-gray-400">
              saleem@peritus.ae
            </p>
          </div>

          <hr className="border-t my-4 border-gray-300 dark:border-neutral-700" />

          <div className="flex justify-between items-center text-sm gap-2">
            <Link
              href="/Profile"
              className="text-white text-center w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 py-2 px-4 rounded uppercase transition-all duration-200"
            >
              View Profile
            </Link>
            <Link
              href="/signout"
              className="text-blue-500 dark:text-white border border-blue-500 dark:border-none text-center w-full bg-blue-50 dark:bg-neutral-600 hover:bg-blue-100 dark:hover:bg-neutral-700 py-2 px-4 rounded uppercase transition-all duration-200"
            >
              Sign Out
            </Link>
            <div className="absolute top-2 right-2">
              <ModeToggler />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
