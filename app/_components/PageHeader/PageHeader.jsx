import Link from "next/link";
import React from "react";

const PageHeader = ({ title, description, enableExtraLinks = false }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
        <p className="text-sm sm:text-base dark:text-neutral-500">
          Back to{" "}
          <Link
            href="/"
            className="text-blue-500 font-semibold hover:underline transition-all"
          >
            Admin Center
          </Link>
        </p>
        {enableExtraLinks && (
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href="/users/main"
              className="text-blue-500 font-semibold hover:underline transition-all text-sm sm:text-base"
            >
              Manage Users
            </Link>
            <Link
              href="/group/main"
              className="text-blue-500 font-semibold hover:underline transition-all text-sm sm:text-base"
            >
              Manage Groups
            </Link>
          </div>
        )}
      </div>
      <div className="mt-2 mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold dark:text-neutral-300">
          {title}
        </h1>
        <p className="text-sm sm:text-base dark:text-neutral-500">
          {description}
        </p>
      </div>
    </>
  );
};

export default PageHeader;
