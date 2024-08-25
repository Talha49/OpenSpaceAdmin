"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IoMdRefresh } from "react-icons/io";
import { FaEllipsisH, FaFileExport, FaFilter, FaSort, FaUserFriends } from "react-icons/fa";
import NewHeader from "@/app/_HOC/NewHeader/NewHeader";
import NewTableComponent from "@/app/_HOC/Table/NewTableComponent";
import { fetchDeletedUsers } from "@/lib/Feature/UserSlice";
import DeleteFilterModal from "@/app/_components/UserDetailDilaog&Modal/DeleteFilterModal";

const DeletedUsers = () => {
  const dispatch = useDispatch();
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCriteria, setFilterCriteria] = useState({});
  const rowsPerPage = 5;

  const handleOpenFilterModal = () => setIsFilterModalOpen(true);
  const handleCloseFilterModal = () => setIsFilterModalOpen(false);
  const handleApplyFilter = (criteria) => {
    setFilterCriteria(criteria);
    setCurrentPage(1); // Reset to first page when filter is applied
    handleCloseFilterModal();
  };

  const getDeletedUsers = async () => {
    const res = await dispatch(fetchDeletedUsers());
    setDeletedUsers(res.payload);
  };

  useEffect(() => {
    getDeletedUsers();
  }, [dispatch]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...deletedUsers];
    
    // Apply search term filter
    if (searchTerm) {
      result = result.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filter criteria
    if (Object.keys(filterCriteria).length > 0) {
      result = result.filter(user => 
        (!filterCriteria.city || user.city === filterCriteria.city) &&
        (!filterCriteria.address || user.address === filterCriteria.address) &&
        (!filterCriteria.contact || user.contact === filterCriteria.contact) &&
        (!filterCriteria.email || user.email === filterCriteria.email)
      );
    }
    
    // Apply sorting
    if (sortConfig.key !== null) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [deletedUsers, searchTerm, filterCriteria, sortConfig]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const paginatedDeletedUsers = filteredAndSortedUsers.slice(indexOfFirstRow, indexOfLastRow);

  const headerItems = [
    { icon: <IoMdRefresh />, label: "Refresh" },
    { icon: <FaFileExport />, label: "Export Delete Users" },
  ];

  const tableColumns = [
    { label: "Display Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Address", key: "address" },
    { label: "City", key: "city" },
    { label: "Contact", key: "contact" },
  ];

  return (
    <div className="min-h-screen py-4">
      <NewHeader>
        <div className="flex flex-col px-4">
          <div className="mb-4 flex flex-col gap-4">
            <h1 className="text-xl font-semibold tracking-wider">Talha.ae</h1>
            <h2 className="text-lg font-semibold tracking-wider">
              Delete Users
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:gap-0 gap-6 sm:items-center justify-between border-t-2 pt-2">
            <div className="flex items-center sm:gap-x-6 gap-x-4 text-[8px]">
              {headerItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-all"
                >
                  <span className="text-lg">{item.icon}</span>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 w-[250px] mr-6">
              <span 
                className="flex items-center text-sm gap-1 cursor-pointer hover:text-blue-500" 
                onClick={handleOpenFilterModal}
              >
                <FaFilter />
                <p>Filter</p>
              </span>
              <input
                type="text"
                placeholder="Search users list"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                className="w-full p-1 border border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </NewHeader>
      <NewTableComponent
        tableColumns={tableColumns.map((col) => (
          <div
            key={col.key}
            className="flex items-center justify-between cursor-pointer w-full"
            onClick={() => handleSort(col.key)}
          >
            <span>{col.label}</span>
            <FaSort className="ml-1" />
          </div>
        ))}
        rowsPerPage={rowsPerPage}
        totalRows={filteredAndSortedUsers.length}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      >
        {paginatedDeletedUsers.map((user) => (
          <tr
            key={user.id}
            className="border-b hover:bg-blue-50 cursor-pointer relative even:bg-gray-100"
          >
            <td className="p-3 text-gray-700">
              <div className="flex items-center justify-between ">
                <span className="hover:text-blue-600">{user.fullName}</span>
              </div>
            </td>
            <td className="p-3 text-gray-700">{user.email}</td>
            <td className="p-3 text-gray-700">{user.address}</td>
            <td className="p-3 text-gray-700">{user.city}</td>
            <td className="p-3 text-gray-700">{user.contact}</td>
          </tr>
        ))}
      </NewTableComponent>
      {isFilterModalOpen && (
        <DeleteFilterModal
          onClose={handleCloseFilterModal}
          onApplyFilter={handleApplyFilter}
          initialFilterCriteria={filterCriteria}
        />
      )}
    </div>
  );
};

export default DeletedUsers;