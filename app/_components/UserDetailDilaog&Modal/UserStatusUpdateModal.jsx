import React, { useState } from "react";
import { useRouter } from "next/navigation";  // Import useRouter from next/router

const UserStatusUpdateModal = ({ user, onClose }) => {
  const [status, setStatus] = useState("inactive"); // Default to inactive status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();  // Initialize router

  const handleUpdateStatus = async () => {
    setLoading(true);
    setError(null); // Reset error before making the request

    // Check if user._id exists
    if (!user._id) {
      setError("User ID is missing");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/Users/UpdateStatus/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`User status updated to ${status}`);
        onClose(); // Close the modal after successful update

        // After update, redirect to the Active Users page
        router.push("/users/active");  // Change to the route where you want to navigate
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (error) {
      setError("An error occurred while updating the status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 w-96 h-auto rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Update User Status</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="inactive">Inactive</option>
            <option value="active">Active</option>
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex gap-4 justify-end">
          <button
            className="px-6 py-2 bg-gray-400 text-white rounded-md shadow-sm hover:bg-gray-500 focus:outline-none"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none"
            onClick={handleUpdateStatus}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusUpdateModal;
