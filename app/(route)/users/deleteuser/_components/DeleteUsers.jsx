// pages/deletedUsers.js
"use client"
import Table from '@/app/_components/TableComponent/TableComponent';
import { useState, useEffect } from 'react';

const ITEMS_PER_PAGE = 10;

const DeletedUsers = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);



  

  const totalPages = Math.ceil(deletedUsers.length / ITEMS_PER_PAGE);
  const currentData = deletedUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  useEffect(() => {
    const fetchDeletedUsers = async () => {
      try {
        const response = await fetch('/api/getDeletedUser');
        if (response.ok) {
          const data = await response.json();
          setDeletedUsers(data);
        } else {
          console.error("Failed to fetch deleted users");
        }
      } catch (error) {
        console.error("An error occurred while fetching deleted users", error);
      }
    };
    fetchDeletedUsers();
  }, []);
  
  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'city', label: 'City' },
    { key: 'contact', label: 'Contact' },
  ];
  return (
    <div className="min-h-screen py-4">
      <h1 className="text-2xl font-bold mb-4">Deleted Users</h1>
      {/* <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
            <th className="border border-gray-300 px-4 py-2">City</th>
            <th className="border border-gray-300 px-4 py-2">Contact</th>
          </tr>
        </thead>
        <tbody>
          {deletedUsers.map((user) => (
            <tr key={user.id}>
              <td className="border border-gray-300 px-4 py-2">{user.fullName}</td>
              <td className="border border-gray-300 px-4 py-2">{user.email}</td>
              <td className="border border-gray-300 px-4 py-2">{user.address}</td>
              <td className="border border-gray-300 px-4 py-2">{user.city}</td>
              <td className="border border-gray-300 px-4 py-2">{user.contact}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
      <Table 
        data={currentData}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      /> 
    </div>
  );
};

export default DeletedUsers;