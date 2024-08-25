"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";

const UserDetailDialog = ({ user, onClose }) => {
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) setIsOpen(true);
  }, [user]);

  if (!user) return null;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300); // Match the timeout with the transition duration
  };

  return (
    <Transition
      show={isOpen}
      enter="transition-transform duration-300 ease-in-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transition-transform duration-300 ease-in-out"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
      className="fixed top-[4rem] right-0 h-screen z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full overflow-y-auto fixed top-0 right-0 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">User Details</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
          <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col p-6 space-y-6">
          {/* Image Section */}
          <div className="text-center flex items-center ">
            
            <div className="relative w-28 h-28 ">
              
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  DP
                </div>
              )}
            </div>
            <div className="mt-4 ml-5">
            <h3 className="text-xl font-semibold mb-4">{user.fullName}</h3>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={profileImage ? handleRemoveImage : handleUploadClick}
                className="bg-blue-500 text-white px-2 py-1 text-xs rounded hover:bg-blue-600 transition duration-300"
              >
                {profileImage ? "Remove" : "Upload photo"}
              </button>
            </div>
          </div>
          {/* User Details Section */}
          <div>
            <div className="space-y-3">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {user.address}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Contact:</strong> {user.contact}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default UserDetailDialog;
