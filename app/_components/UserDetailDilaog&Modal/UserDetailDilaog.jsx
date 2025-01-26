"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

const UserDetailDialog = ({ user, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) setIsOpen(true);
  }, [user]);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose); // Match the timeout with the transition duration
  };

  if (!user) return null;

  return (
    <>
      {/* Blurry Background */}
      <Transition
        show={isOpen}
        as="div"
        className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm"
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-70"
        leave="transition-opacity duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        onClick={handleClose}
      />

      {/* Sidebar Modal */}
      <Transition
        show={isOpen}
        as="div"
        className="fixed top-0 right-0 h-full z-50 bg-white dark:bg-neutral-900 shadow-xl w-full max-w-lg overflow-y-auto"
        enter="transition-transform duration-300 ease-in-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-300 ease-in-out"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-300 dark:border-neutral-800">
          <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">
            User Details
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="text-center p-6 border-b border-neutral-300 dark:border-neutral-800">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={user.image || "/images/avatar.png"} // Replace with default image
              alt={`${user.fullName}'s Profile`}
              layout="fill"
              objectFit="cover"
              className="rounded-full border-4 border-blue-500"
            />
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            {user.fullName}
          </h3>
        </div>

        {/* User Details Form */}
        <div className="p-6 space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={user.email}
              disabled // Disabled to make it non-selectable
              className="mt-1 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-800 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            />
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              value={user.address || "Not Provided"}
              disabled // Disabled to make it non-selectable
              className="mt-1 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-800 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            />
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              City
            </label>
            <input
              type="text"
              id="city"
              value={user.city || "Not Provided"}
              disabled // Disabled to make it non-selectable
              className="mt-1 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-800 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            />
          </div>

          {/* Contact */}
          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              Contact
            </label>
            <input
              type="text"
              id="contact"
              value={user.contact || "Not Provided"}
              disabled // Disabled to make it non-selectable
              className="mt-1 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-800 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            />
          </div>

          {/* MFA Detail (example) */}
          <div>
            <label
              htmlFor="mfa"
              className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
            >
              MFA Status
            </label>
            <input
              type="text"
              id="mfa"
              value={user.multifactorAuthentication ? "Enabled" : "Not Enabled"}
              disabled // Disabled to make it non-selectable
              className="mt-1 block w-full px-4 py-2 border border-neutral-300 dark:border-neutral-800 rounded-md bg-gray-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            />
          </div>
        </div>
      </Transition>
    </>
  );
};

export default UserDetailDialog;
