import React, { useState } from 'react';
import bcrypt from 'bcryptjs'; // For hashing password

// Password modal component
const PasswordModal = ({ isOpen, onClose, users, onPasswordUpdate }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordGeneration = () => {
    const generatedPassword = generatePassword();
    setNewPassword(generatedPassword);
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handlePasswordSave = async () => {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await onPasswordUpdate(selectedUser.id, hashedPassword); // Assume this function updates the password in the DB
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl mb-4">Update User Password</h2>
          <div>
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center mb-2">
                <span>{user.fullName}</span>
                <button
                  className="text-blue-500"
                  onClick={() => setSelectedUser(user)}
                >
                  Update Password
                </button>
              </div>
            ))}
          </div>
          {selectedUser && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border p-2 mb-4 w-full"
              />
              <button
                onClick={handlePasswordGeneration}
                className="bg-blue-500 text-white p-2 mb-4 w-full"
              >
                Generate Password
              </button>
              <button
                onClick={handlePasswordSave}
                className="bg-green-500 text-white p-2 w-full"
              >
                Update Password
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="mt-4 text-red-500"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

// Usage example
const TableRoute = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, fullName: 'John Doe', status: 'active' },
    { id: 2, fullName: 'Jane Smith', status: 'active' },
    // Other users
  ]);

  const handlePasswordUpdate = async (userId, hashedPassword) => {
    // Update password in the database here
    console.log(`Updating password for user ${userId} with hashed password ${hashedPassword}`);
  };

  return (
    <div>
      <button onClick={() => setIsPasswordModalOpen(true)}>Manage Passwords</button>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        users={users.filter(user => user.status === 'active')}
        onPasswordUpdate={handlePasswordUpdate}
      />
    </div>
  );
};

export default TableRoute;
