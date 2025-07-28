"use client"; // This makes sure the page is rendered client-side

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ManageGroups = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Fetch user details and groups when router is ready
  useEffect(() => {
    if (!router.isReady) return; // Wait for router to be ready

    const { userId } = router.query;

    // Check if userId is available in the query params
    if (!userId) {
      router.push("/users/active"); // Redirect to active users page if no userId
      return;
    }

    console.log("Fetching details for userId:", userId);

    const fetchUserDetails = async () => {
      try {
        console.log("Fetching user details...");
        const res = await fetch(`/api/getUserDetails?userId=${userId}`);
        const data = await res.json();

        if (res.ok) {
          console.log("User data fetched:", data);
          setSelectedUser(data.user);
          setUserGroups(data.groups);
        } else {
          setError("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("An error occurred while fetching data.");
      }
    };

    fetchUserDetails();
  }, [router.isReady, router.query]);

  // Show error if fetching fails
  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={() => router.push("/users/active")}
          className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4 hover:bg-blue-600 transition"
        >
          Go Back to Active Users
        </button>
      </div>
    );
  }

  // Handle leaving a group
  const handleLeaveGroup = async (groupId) => {
    try {
      console.log(`User ${selectedUser._id} leaving group ${groupId}...`);
      const res = await fetch(
        `/api/leaveGroup?userId=${selectedUser._id}&groupId=${groupId}`,
        {
          method: "POST",
        }
      );

      if (res.ok) {
        console.log("User left the group successfully");
        // Update user groups after leaving the group
        setUserGroups(userGroups.filter((group) => group.id !== groupId));
        toast.success("User left the group successfully.");
      } else {
        toast.error("Failed to leave the group.");
      }
    } catch (error) {
      console.error("Error leaving the group:", error);
      toast.error("An error occurred while leaving the group.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* User Info Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          Manage Groups for{" "}
          {selectedUser ? selectedUser.fullName : "Loading..."}
        </h1>
        <p className="text-xl text-gray-700">
          {selectedUser
            ? `Email: ${selectedUser.email}`
            : "Loading user email..."}
        </p>
        <p className="text-md text-gray-600 mt-2">
          {selectedUser
            ? `Contact: ${selectedUser.contact}`
            : "Loading contact..."}
        </p>
        <p className="text-md text-gray-600 mt-2">
          {selectedUser
            ? `Address: ${selectedUser.address}`
            : "Loading address..."}
        </p>
      </div>

      {/* Groups Section */}
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h2 className="text-2xl font-medium text-gray-800 mb-6">
          User&lsquo;s Groups
        </h2>

        {userGroups.length > 0 ? (
          <ul className="space-y-4">
            {userGroups.map((group) => (
              <li
                key={group.id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-5 rounded-lg shadow-md hover:bg-gray-200 transition-all ease-in-out"
              >
                <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-6 items-start md:items-center">
                  <span className="text-lg font-semibold text-gray-800">
                    {group.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {group.description || "No description available"}
                  </span>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Owner: {group.owner || "N/A"}
                  </span>
                  <span className="text-sm text-gray-600">
                    Members: {group.members.length || 0}
                  </span>
                  <button
                    onClick={() => handleLeaveGroup(group.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200 ease-in-out"
                  >
                    Leave Group
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No groups found for this user.</p>
        )}
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/users/active")}
          className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition"
        >
          Back to Active Users
        </button>
      </div>
    </div>
  );
};

export default ManageGroups;
