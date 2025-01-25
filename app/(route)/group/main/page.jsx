"use client";

import Link from "next/link";

export default function GroupsPage() {
  return (
    <div className="flex flex-col items-center justify-center mt-14 bg-transparent mx-4">
      {/* Main Page Heading */}
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
        Groups Management Dashboard
      </h1>
      {/* Subheading */}
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 text-center max-w-2xl">
        Manage your groups effortlessly with tools to create, organize, and review active or archived groups.
      </p>

      {/* Link Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* Manage & Create Groups */}
        <Link
          href={"/group"}
          className="cursor-pointer p-8 bg-neutral-100 dark:bg-neutral-800 hover:scale-105 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center hover:shadow-xl transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Create Groups
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create new groups, edit existing ones, and organize group details with ease.
          </p>
        </Link>

        {/* Active Groups */}
        <Link
          href={"/group/ActiveGroups"}
          className="cursor-pointer p-8 bg-neutral-100 dark:bg-neutral-800 hover:scale-105 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center hover:shadow-lg transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Active Groups
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View and manage all active groups within your organization.
          </p>
        </Link>

        {/* Archived Groups */}
        <Link
          href={"/group/DeleteGroups"}
          className="cursor-pointer p-8 bg-neutral-100 dark:bg-neutral-800 hover:scale-105 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center hover:shadow-xl transition duration-300"
        >
          <h2 className="text-2xl font-semibold text-blue-700 mb-2">
            Deleted Groups
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Access and restore groups that have been archived for future use.
          </p>
        </Link>
      </div>
    </div>
  );
}
