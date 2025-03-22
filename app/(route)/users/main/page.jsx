"use client";

import Link from "next/link";

export default function UsersPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-14 bg-transparent mx-4">
      {/* Main Page Heading */}
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
        User Management Dashboard
      </h1>
      {/* Subheading */}
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center max-w-2xl">
        Easily manage your user base with tools to create, view, and organize
        active or deleted users.
      </p>

      {/* Link Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Create Users */}
        <Link
          href={"/users"}
          className="cursor-pointer p-8 group bg-neutral-100 hover:bg-blue-500 hover:dark:bg-blue-600 dark:bg-neutral-800 hover:scale-105 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center hover:shadow-xl transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-700 group-hover:text-white mb-2">
            Create User
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white">
            Add new users, edit profiles, and organize your user database
            efficiently.
          </p>
        </Link>

        {/* Active Users */}
        <Link
          href={"/users/active"}
          className="cursor-pointer p-8 group bg-neutral-100 hover:bg-blue-500 hover:dark:bg-blue-600 dark:bg-neutral-800 hover:scale-105 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center hover:shadow-xl transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-700 group-hover:text-white mb-2">
            Active Users
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white">
            View all active users and manage their permissions or details.
          </p>
        </Link>

        {/* Deleted Users */}
        <Link
          href={"/users/deleted"}
          className="cursor-pointer p-8 group bg-neutral-100 hover:bg-blue-500 hover:dark:bg-blue-600 dark:bg-neutral-800 hover:scale-105 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center hover:shadow-xl transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-700 group-hover:text-white mb-2">
            Deleted Users
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white">
            Review and restore users that have been deleted from the system.
          </p>
        </Link>
      </div>
    </div>
  );
}
