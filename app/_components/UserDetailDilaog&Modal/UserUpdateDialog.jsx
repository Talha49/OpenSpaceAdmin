"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import { FaTimes, FaSyncAlt, FaEdit, FaEyeSlash, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/firebase/firebaseConfig";
import { ref, uploadString, getDownloadURL } from "firebase/storage"
import { fetchUsers } from "@/lib/Feature/UserSlice";
const UserUpdateDialog = ({ user, onClose, onSave }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({ ...user });
    const [isEditable, setIsEditable] = useState(false); // Track edit state
    const [profileImage, setProfileImage] = useState(user.profileImage || null);
    const fileInputRef = useRef(null); // Ref for file input
    const [showOldPassword, setShowOldPassword] = useState(false); // Toggle visibility of old password
    const [newPassword, setNewPassword] = useState(""); // Generated new password
    const [isSaving, setIsSaving] = useState(false); // Track saving state
    const [users, setUsers] = useState([]); // State for storing all users
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (formData.email) {
            handleRefresh(); // Fetch active user data on mount
        }
    }, [formData.email]);
    
    useEffect(() => {
        if (user) {
            setIsOpen(true);
            setFormData({ ...user });
            setProfileImage(user.profileImage || null);
        }
    }, [user]);

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setIsEditable(true); // Enable editing
    };

    const handleCancel = () => {
        setFormData({ ...user }); // Reset form data to original user data
        setNewPassword(""); // Clear the generated password
        setProfileImage(user.profileImage || null); // Reset image
        setIsEditable(false); // Disable editing
    };

    //handle save with api HIT 
    const handleSave = async () => {
        setIsSaving(true); // Show "Saving..." on Save button
        try {
            // Step 1: Upload the image to Firebase and get the URL
            const imageUrl = await uploadImageToFirebase();

            // Step 2: Use the new image URL (or fallback to existing profileImage if no new image uploaded)
            const updatedProfileImage = imageUrl || profileImage;

            const response = await fetch("/api/Users/updateUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    image: updatedProfileImage, // Send the Firebase image URL
                    password: newPassword || undefined, // Send the new password if generated
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                // Parse the response JSON

                throw new Error(errorData.message || "Failed to update user.");

            }
            dispatch(fetchUsers());
            router.push("/users/active");
            const result = await response.json();
            console.log("API Response Data:", result);
            if (result && result.user) {
                setProfileImage(result.user.image); // Update the displayed profile image
                setFormData(result.user); // Update the form with the latest user details
                console.log("User updated and email sent successfully.");
                setIsEditable(false); // Disable editing
            }
        } catch (error) {
            console.error("Error saving user details:", error);
            alert("An error occurred while saving. Please try again.");
        } finally {
            setIsSaving(false); // Re-enable Save button
            setIsEditable(false); // Exit edit mode if the user confirms
        }
    };



    //handle image upload and also handle image upload to firebase
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // Update state with base64 image
            };
            reader.readAsDataURL(file); // Read file as base64
        }
    };
    const uploadImageToFirebase = async () => {
        // Skip upload if no new image is selected or the image is already a URL
        if (!profileImage || !profileImage.startsWith("data:image")) {
            console.log("No new base64 image to upload.");
            return null; // Return null to indicate no new upload occurred
        }

        try {
            const storageRef = ref(storage, `UserImagesetByAdmin/${formData.email}/profileImage.jpg`);
            await uploadString(storageRef, profileImage, "data_url");
            const imageUrl = await getDownloadURL(storageRef);
            console.log("Uploaded image URL:", imageUrl);
            return imageUrl;
        } catch (error) {
            console.error("Error uploading image to Firebase:", error);
            throw error; // Let the caller handle the error
        }
    };


    const handleImageEditClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger file input click
        }
    };
    
    const handleRefresh = async () => {
        try {
            const response = await fetch("/api/Users/getUser"); // Fetch all active users
            if (!response.ok) {
                throw new Error("Failed to fetch users.");
            }
    
            const users = await response.json(); // Parse the JSON response
            console.log("Fetched active users:", users);
    
            // Find the current user in the fetched users list
            const currentUser = users.find((u) => u.email === formData.email);
    
            if (!currentUser) {
                throw new Error("Current user not found among active users.");
            }
    
            // Update state with the current user's data
            setFormData({
                fullName: currentUser.fullName || "",
                email: currentUser.email || "",
                address: currentUser.address || "",
                city: currentUser.city || "",
                image: currentUser.image || "/images/avatar.png",
            });
    
            setProfileImage(currentUser.image || "/images/avatar.png");
        } catch (error) {
            console.error("Error refreshing active user details:", error);
            alert("Failed to refresh user details. Please try again.");
        }
    };
    
    
    
    
    const generateRandomPassword = () => {
        const generatedPassword = Math.random().toString(36).slice(-8); // Generate an 8-character password
        setNewPassword(generatedPassword);
        console.log(`Generated Password: ${generatedPassword}`);
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
                enterTo="opacity-100"
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
                <div className="flex items-center justify-between p-4 border-b border-neutral-300 dark:border-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                            <Image
                                src={profileImage || user.image || "/images/avatar.png"} // Display user.image initially
                                alt={`${user.fullName}'s Profile`}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-full"
                            />

                            {isEditable && (
                                <button
                                    onClick={handleImageEditClick}
                                    className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full shadow hover:bg-blue-600 transition"
                                >
                                    <FaEdit className="w-4 h-4" />
                                </button>
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                                {user.fullName}
                            </h2>
                            <button
                                className="text-sm text-blue-500 hover:underline"
                                onClick={handleRefresh}
                            >
                                <FaSyncAlt className="inline mr-1" />
                                Refresh details
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-400"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Details Form */}
                <div className="p-6 space-y-6">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            readOnly={!isEditable} // Make non-editable if not in edit mode
                            className={`mt-1 block w-full px-4 py-2 border ${isEditable
                                ? "bg-white border-neutral-300 dark:border-neutral-800"
                                : "bg-gray-100 dark:bg-neutral-800 border-transparent"
                                } rounded-md text-neutral-700 dark:text-neutral-300`}
                        />
                    </div>

                    <div className="relative group">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className={`mt-1 block w-full px-4 py-2 border ${isEditable
                                ? "bg-white border-neutral-300 dark:border-neutral-800"
                                : "bg-gray-100 dark:bg-neutral-800 border-transparent"
                                } rounded-md text-neutral-700 dark:text-neutral-300 cursor-not-allowed`}
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
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            readOnly={!isEditable}
                            className={`mt-1 block w-full px-4 py-2 border ${isEditable
                                ? "bg-white border-neutral-300 dark:border-neutral-800"
                                : "bg-gray-100 dark:bg-neutral-800 border-transparent"
                                } rounded-md text-neutral-700 dark:text-neutral-300`}
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
                            name="city"
                            value={formData.city || ""}
                            onChange={handleChange}
                            readOnly={!isEditable}
                            className={`mt-1 block w-full px-4 py-2 border ${isEditable
                                ? "bg-white border-neutral-300 dark:border-neutral-800"
                                : "bg-gray-100 dark:bg-neutral-800 border-transparent"
                                } rounded-md text-neutral-700 dark:text-neutral-300`}
                        />
                    </div>



                    {/* New Password */}
                    {isEditable && (
                        <div>
                            <label
                                className="block text-sm font-medium text-neutral-600 dark:text-neutral-400"
                            >
                                New Password
                            </label>
                            <div className="relative mt-2">
                                <input
                                    type="password" // Mask the password
                                    placeholder="New password"
                                    value={newPassword}
                                    readOnly
                                    className="block w-full px-4 py-2 border bg-white dark:bg-neutral-900 border-neutral-300 rounded-md text-neutral-700 dark:text-neutral-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const generatedPassword = Math.random().toString(36).slice(-8); // Generate a random password
                                        setNewPassword(generatedPassword); // Update the newPassword state
                                    }}
                                    className="absolute inset-y-0 right-3 bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                                >
                                    Generate
                                </button>
                            </div>
                        </div>
                    )}


                    {/* Action Buttons */}
                    {isEditable ? (
                        <div className="flex items-center justify-between gap-4">
                            <button
                                onClick={handleSave}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                            >
                                {isSaving ? "Saving..." : "Save"}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </Transition>
        </>
    );
};

export default UserUpdateDialog;
