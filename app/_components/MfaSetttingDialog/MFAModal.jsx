'use client'

import React, { useState, useEffect } from 'react';

export function MFAModal({ isOpen, onClose }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [changedUsers, setChangedUsers] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  // Fetch users from the API
  const fetchUsers = async () => {
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
            console.error('Error updating MFA:', errorData.message);
          }
        }
      }
      onClose(); // This will trigger the modal to close
      // Reset changedUsers set after successful save
      setChangedUsers(new Set());
    } catch (error) {
      console.error('Error saving MFA updates:', error);
    }
  };

  // Filter users based on search query
  const filteredUsers = activeUsers.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Multifactor Authentication for Users</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
        />

        {/* User List with Scroll */}
        <div className="mt-4 space-y-4 max-h-60 overflow-y-auto scrollbar-hidden">
          {filteredUsers.map((user) => (
            <div key={user._id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.fullName}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={user.multifactorAuthentication}
                  onChange={(e) => handleToggleMFA(user._id, e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
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
            disabled={changedUsers.size === 0} // Disable if no changes
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
