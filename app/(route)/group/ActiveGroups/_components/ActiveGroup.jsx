// pages/ActiveGroups.js
"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FaTrash, FaSyncAlt } from "react-icons/fa";
import { deleteGroups, fetchGroups } from '@/lib/Feature/GroupSlice';
import Header from '@/app/_HOC/Header/Header';
import Table from '@/app/_components/TableComponent/TableComponent';

const ActiveGroups = () => {
  const dispatch = useDispatch();
  const groups = useSelector(state => state.group.groups);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleRefresh = () => dispatch(fetchGroups());

  const toggleDeleteMode = () => setDeleteMode(!deleteMode);

  const handleBulkDelete = () => {
    dispatch(deleteGroups(selectedGroups));
    setSelectedGroups([]);
    setDeleteMode(false);
  };

  const buttons = [
    { icon: FaTrash, text: "Delete", onClick: toggleDeleteMode },
    { icon: FaSyncAlt, text: "Refresh", onClick: handleRefresh },
  ];

  const columns = [
    { key: "name", label: "Group Name" },
    { key: "type", label: "Group Type" },
    { key: "membersCount", label: "Members" },
  ];

  const data = groups.map(group => ({
    ...group,
    membersCount: group.members.length,
  }));

  return (
    <div>
      <Header
        title="peritus.ae"
        subTitle="Active Groups"
        buttons={buttons}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        deleteMode={deleteMode}
        onBulkDelete={handleBulkDelete}
      />
      <Table
        data={data}
        columns={columns}
        selectedItems={selectedGroups}
        onSelectionChange={setSelectedGroups}
        deleteMode={deleteMode}
      />
    </div>
  );
};

export default ActiveGroups;