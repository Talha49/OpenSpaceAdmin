import {
  FaUserPlus,
  FaFileAlt,
  FaUserFriends,
  FaShieldAlt,
  FaTrash,
  FaSyncAlt,
  FaKey,
  FaFileExport,
  FaFilter,
  FaSearch,
  FaEllipsisH,
  FaSort,
  FaEllipsisV,
  FaTimes,
} from "react-icons/fa";
import { BsColumns, BsMoon } from "react-icons/bs";
import React, { useEffect, useState, useRef } from "react";

const ActiveUserComp = () => {
  const [users, setUsers] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [sortOrder, setSortOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [editUserData, setEditUserData] = useState({}); // To hold updated data
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/getUser");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed To Fetch Data");
        }
      } catch (error) {
        console.error("An error occurred while fetching users", error);
      }
    };
    fetchUser();
  }, []);

  const filterUser = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchItem.toLowerCase())
  );

  const handleSort = () => {
    let sortedUser;
    if (sortOrder === "asc") {
      sortedUser = [...users].sort((a, b) => b.fullName.localeCompare(a.fullName));
      setSortOrder("desc");
    } else {
      sortedUser = [...users].sort((a, b) => a.fullName.localeCompare(b.fullName));
      setSortOrder("asc");
    }
    setUsers(sortedUser);
  };

  const handleEllipsisClick = (event, user) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleEdit = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`/api/updateUser`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedUser.id, ...editUserData }),
        });

        if (response.ok) {
          const updatedUser = await response.json();
          setUsers(users.map(user => (user.id === selectedUser.id ? updatedUser : user)));
          setShowModal(false);
        } else {
          console.error("Failed to update user");
        }
      } catch (error) {
        console.error("An error occurred while updating user", error);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        const response = await fetch(`/api/deleteUser`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedUser.id }),
        });

        if (response.ok) {
          setUsers(users.filter(user => user.id !== selectedUser.id));
          setShowModal(false);
        } else {
          console.error("Failed to delete user");
        }
      } catch (error) {
        console.error("An error occurred while deleting user", error);
      }
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">peritus.ae</h1>
          <button className="text-gray-600 hover:text-gray-800 flex items-center gap-2 text-sm">
            Dark mode <BsMoon className="w-5 h-5 text-sm" />
          </button>
        </div>

        <h1 className="font-semibold text-xl mb-4">Active Users</h1>

        <div className="flex flex-wrap items-center gap-2 border-t-2 pt-2">
          <ActionButton icon={<FaUserPlus />} text="Add a user" />
          <ActionButton icon={<FaFileAlt />} text="User templates" />
          <ActionButton icon={<FaUserFriends />} text="Add multiple users" />
          <ActionButton icon={<FaShieldAlt />} text="Multi-factor authentication" />
          <ActionButton icon={<FaTrash />} text="Delete a user" />
          <ActionButton icon={<FaSyncAlt />} text="Refresh" />
          <ActionButton icon={<FaKey />} text="Reset password" />
          <ActionButton icon={<FaFileExport />} text="Export users" />
          <ActionButton icon={<FaEllipsisH />} text="" />

          <div className="flex-grow flex items-center gap-2 mt-2 sm:mt-0 md:ml-8 ml-0">
            <button className="flex items-center gap-1 px-2 py-1 text-xs">
              <FaFilter className="w-4 h-4 text-blue-500" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users list"
                onChange={(e) => setSearchItem(e.target.value)}
                value={searchItem}
                className="w-[70%] pl-10 pr-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <div className="bg-white p-4 shadow rounded" ref={tableRef}>
          {filterUser.length > 0 ? (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-semibold text-gray-600">
                    <div className="flex items-center">
                      Display name
                      <FaSort onClick={handleSort} className="ml-1 text-gray-400 cursor-pointer" />
                    </div>
                  </th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-600">Username</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-600">Address</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-600">City</th>
                  <th className="py-2 px-4 text-left font-semibold text-gray-600">Contact</th>
                </tr>
              </thead>
              <tbody>
                {filterUser.map((user) => (
                  <tr key={user.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-2 px-4">
                      <div className="flex items-center justify-between">
                        <span>{user.fullName}</span>
                        <FaEllipsisH className="text-gray-400 rotate-90 cursor-pointer" onClick={(e) => handleEllipsisClick(e, user)} />
                      </div>
                    </td>
                    <td className="py-2 px-4 text-gray-600">{user.email}</td>
                    <td className="py-2 px-4 text-gray-600">{user.address}</td>
                    <td className="py-2 px-4 text-gray-600">{user.city}</td>
                    <td className="py-2 px-4 text-gray-600">{user.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No results found</div>
          )}
        </div>
      </div>

      {showModal && selectedUser && (
        <div className="absolute z-50 bg-white rounded-lg p-4 shadow-lg" style={{ top: modalPosition.top, left: modalPosition.left }}>
          <button className="ml-auto mb-4 text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="flex flex-col gap-2">
            <button onClick={handleEdit} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Edit User</button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete User</button>
          </div>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, text }) => (
  <button className="flex items-center gap-1 hover:text-blue-600">
    {icon}
    <span className="hidden sm:inline">{text}</span>
  </button>
);

export default ActiveUserComp;




























"use client"
import { addUser } from '@/lib/Feature/UserSlice'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const FormComp = () => {

   const router = useRouter()
   
   const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    contact: '',
   })



const dispatch = useDispatch()

const handleChange = (e) => {
  const {name, value} = e.target;
  setFormData({
    ...formData,
    [name]:value
  });
}



const handleSubmit = async (e) => {
  e.preventDefault();

  for(const key in formData){
    if(formData[key] === ''){
      alert("Please fill all the fields")
      return;
    }
    
  } 



  dispatch(addUser(formData));
  setFormData({
      fullName: '',
      email: '',
      address: '',
      city: '',
      contact: ''
  });

  try {
      const response = await fetch('/api/saveUser', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
      });

      if (response.ok) {
          alert('User saved successfully!');
      } else {
          const errorData = await response.json();
          alert(`Failed to save user: ${errorData.error}`);
      }
  } catch (error) {
      alert('An error occurred while saving the user');
  }

  router.push('/users/activeuser')
};




    return (
        <div className="w-full max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-1">User Form</h2>
        <p className="text-sm text-gray-500 mb-6">Fill date for the user. Give it a try.</p>
        
        <div className="bg-white rounded-lg shadow-md p-8 ">
          <div className="flex flex-col md:flex-row justify-around">
            {/* Left Section */}
            <div className=" mb-6 md:mb-0">
              <h3 className="text-lg font-semibold text-gray-700 mb-1">Personal Details</h3>
              <p className="text-sm text-gray-500 mb-4">Please fill out all the fields.</p>
              <div className="space-y-2">
                <button className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Delete</button>
                <button className="w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400">Edit</button>
              </div>
            </div>
            
            {/* Right Section - Form */}
            <div className="">
              <form className="space-y-4" >
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input required type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input required type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@domain.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div className="flex flex-col md:flex-row md:space-x-4">
                  <div className="md:w-1/2 mb-4 md:mb-0">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address / Street</label>
                    <input required type="text" id="address" name="address" value={formData.address}  onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  
                  <div className="md:w-1/2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input required type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                  <input required type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                
                <div className="mt-6">
                  <button onClick={handleSubmit} type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default FormComp
