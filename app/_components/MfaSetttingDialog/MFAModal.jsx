'use client'

import React, { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Importing the loading spinner

export function MFAModal({ isOpen, onClose }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [changedUsers, setChangedUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false); // Loading state to track fetching process
  const [saving, setSaving] = useState(false); // New state to track saving process
  const [errorMessage, setErrorMessage] = useState(''); // State to store any error messages

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await fetch('/api/Users/MfaUsersget');
      if (response.ok) {
        const users = await response.json();
        setActiveUsers(users);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false); // Stop loading when the fetch completes
    }
  };

  // Handle toggle event for MFA
  const handleToggleMFA = (userId, newStatus) => {
    setActiveUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? {
              ...user,
              multifactorAuthentication: newStatus,  // Ensure this is a boolean
            }
          : user
      )
    );

    // Track changes in MFA status (add or remove from changedUsers)
    setChangedUsers((prev) => {
      const updated = new Set(prev);
      if (newStatus) {
        updated.add(userId);  // If MFA is turned on, add userId to changed set
      } else {
        updated.add(userId);  // Even if MFA is turned off, we want to track this change
      }
      return updated;
    });
  };

  // Handle saving changes to the database
  const handleSave = async () => {
    setSaving(true); // Start saving process
    setErrorMessage(''); // Reset error message before starting save
    try {
      // Loop over each user whose MFA status has changed
      for (const userId of changedUsers) {
        const user = activeUsers.find((user) => user._id === userId);
        if (user) {
          const response = await fetch(`/api/Users/Mfaupdate/${userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              multifactorAuthentication: user.multifactorAuthentication,  // Send boolean value (true/false)
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message); // Throw error if response is not OK
          }
        }
      }
      setSaving(false); // Stop saving process
      onClose(); // This will trigger the modal to close
      // Reset changedUsers set after successful save
      setChangedUsers(new Set());
    } catch (error) {
      setSaving(false); // Stop saving process
      setErrorMessage(error.message || 'Error saving MFA updates'); // Show error message
    }
  };

  // Filter users based on search query (alphabet match)
  const filteredUsers = activeUsers.filter((user) =>
    user.fullName.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  // Function to highlight matching text in the name or email
  const highlightText = (text, query) => {
    if (!query) return text; // If no query, return text as is
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-300">{part}</span>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 dark:text-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Multifactor Authentication for Users</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by alphabet..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 dark:bg-gray-800 dark:text-white rounded-lg"
        />

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">
            {errorMessage}
          </div>
        )}

        {/* User List with Scroll */}
        <div className="mt-4 space-y-4 max-h-60 overflow-y-auto scrollbar-hidden">
          {loading ? (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-blue-500 text-3xl" /> {/* Loading Spinner */}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-300">
              No users found.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {highlightText(user.fullName, searchQuery)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {highlightText(user.email, searchQuery)}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={user.multifactorAuthentication}
                    onChange={(e) => handleToggleMFA(user._id, e.target.checked)}
                  />
                   <div className="w-11 h-6 bg-gray-200 peer-focus:outline-4 peer-focus:outline-blue-300 dark:peer-focus:outline-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))
          )}
        </div>

        {/* Save and Cancel Buttons */}
        <div className="flex justify-between mt-6 gap-4">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="w-1/2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            disabled={changedUsers.size === 0 || saving} // Disable if no changes or saving
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
