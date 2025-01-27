"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { FaTimes, FaCamera } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase/firebaseConfig"; // Firebase config file
import { useDispatch } from "react-redux";
import { fetchUsers } from "@/lib/Feature/UserSlice";
const UserDetailDialog = ({ user: initialUser, onClose, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [tempUser, setTempUser] = useState(initialUser);
  const [imagePreview, setImagePreview] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state for saving
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialUser) {
      setIsOpen(true);
      setUser(initialUser);
      setTempUser(initialUser);
    }
  }, [initialUser]);

  const handleMfaToggle = () => {
    setTempUser((prevUser) => ({
      ...prevUser,
      multifactorAuthentication: !prevUser.multifactorAuthentication,
    }));
    setHasChanges(true);
  };

  const handleClose = () => {
    if (!isSaving) {
      setIsOpen(false);
      setTimeout(() => {
        onClose();
        setIsEditing(false);
        setImagePreview(null);
        setHasChanges(false);
      }, );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempUser((prevUser) => ({ ...prevUser, [name]: value }));
    setHasChanges(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
  
      setIsUploading(true);
      const storageRef = ref(storage, `users/${initialUser.id}/${file.name}`);
  
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Get the upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        },
        (error) => {
          console.error("Error uploading image:", error);
          setHasChanges(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setTempUser((prevUser) => ({ ...prevUser, image: downloadURL }));
          setHasChanges(true);
          setIsUploading(false);
        }
      );
    }
  };
  
  useEffect(() => {
       dispatch(fetchUsers())
  }, []);

  const handleSave = async () => {
    setIsSaving(true); // Start saving
    try {
      await fetch("/api/Users/updateDetailModal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempUser),
      });
      dispatch(fetchUsers());
      setUser(tempUser);
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving user data:", error);
    } finally {
      setIsSaving(false); // End saving
    }
  };

  const handleCancel = () => {
    setTempUser(user);
    setImagePreview(null);
    setIsEditing(false);
    setHasChanges(false);
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
        leaveFrom="opacity-70"
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
          <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-300">User Details</h2>
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
              src={imagePreview || user.image || "/images/avatar.png"}
              alt={`${user.fullName}'s Profile`}
              layout="fill"
              objectFit="cover"
              className="rounded-full border-4 border-blue-500"
            />
            {isEditing && (
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer"
              >
                <FaCamera className="text-white" />
                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">{user.fullName}</h3>
        </div>

        {/* User Details Form */}
        <div className="p-6 space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={user.email}
              readOnly
              className="mt-1 block w-full px-4 py-2 border bg-gray-100 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-700 dark:text-neutral-300 cursor-not-allowed"
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={tempUser.address || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-4 py-2 border ${
                isEditing ? "bg-white dark:bg-neutral-700" : "bg-gray-100 dark:bg-neutral-800"
              } border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-700 dark:text-neutral-300`}
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={tempUser.city || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-4 py-2 border ${
                isEditing ? "bg-white dark:bg-neutral-700" : "bg-gray-100 dark:bg-neutral-800"
              } border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-700 dark:text-neutral-300`}
            />
          </div>

          {/* Contact */}
          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Contact
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={tempUser.contact || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`mt-1 block w-full px-4 py-2 border ${
                isEditing ? "bg-white dark:bg-neutral-700" : "bg-gray-100 dark:bg-neutral-800"
              } border-neutral-300 dark:border-neutral-800 rounded-md text-neutral-700 dark:text-neutral-300`}
            />
          </div>

          {/* MFA Toggle */}
          <div>
            <label htmlFor="mfa" className="block text-sm font-medium text-neutral-600 dark:text-neutral-400">
              MFA Status
            </label>
            <div className="mt-1 flex items-center">
              <button
                onClick={handleMfaToggle}
                disabled={!isEditing}
                className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                  tempUser.multifactorAuthentication ? "bg-blue-600" : "bg-gray-200"
                } ${isEditing ? "cursor-pointer" : "cursor-not-allowed"}`}
              >
                <span
                  className={`${
                    tempUser.multifactorAuthentication ? "translate-x-6" : "translate-x-1"
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </button>
              <span className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">
                {tempUser.multifactorAuthentication ? "Enabled" : "Disabled"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer with Buttons */}
        <div className="p-4 border-t border-neutral-300 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800">
          {isEditing ? (
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  hasChanges && !isSaving
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "text-gray-500 bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Edit
            </button>
          )}
        </div>
      </Transition>
    </>
  );
};

export default UserDetailDialog;
