// pages/deletedUsers.js
"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Table from "@/app/_components/TableComponent/TableComponent";
import {
  fetchDeletedUsers,
  selectDeletedUsersTotalPages,
  selectPaginatedDeletedUsers,
  setDeletedUsersCurrentPage,
} from "@/lib/Feature/UserSlice";

const DeletedUsers = () => {
  const dispatch = useDispatch();
  const deletedUsers = useSelector(selectPaginatedDeletedUsers);
  const totalPages = useSelector(selectDeletedUsersTotalPages);
  const currentPage = useSelector(
    (state) => state.user.deletedUsersCurrentPage
  );

  useEffect(() => {
    dispatch(fetchDeletedUsers());
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(setDeletedUsersCurrentPage(page));
  };

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: "city", label: "City" },
    { key: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen py-4">
      <h1 className="text-2xl font-bold mb-4">Deleted Users</h1>
      <Table
        data={deletedUsers}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default DeletedUsers;
