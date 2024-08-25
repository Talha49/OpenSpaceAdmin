"use client"
import React, { useState, useEffect } from "react";

const GetDeleteFilterModal = ({ onClose, onApplyFilter }) => {
  const [deletegroupType, setDeleteGroupType] = useState("");
  const [deletegroupTypes, setDeleteGroupTypes] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await fetch("/api/Groups/getDeletedGroups");
        if (response.ok) {
          const data = await response.json();
          // Assuming the structure is {deletedGroups: [{groupType: "Type 2", ...}]}
          const groups = data.deletedGroups || [];
          const uniqueTypes = [...new Set(groups.map((group) => group.groupType))];
          setDeleteGroupTypes(uniqueTypes);
        }
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };

    fetchFilterData();
  }, []);

  const handleApplyFilter = () => {
    onApplyFilter({ groupType: deletegroupType });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Filter Groups</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Group Type</label>
          <select
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none max-h-40 overflow-y-auto"
            value={deletegroupType}
            onChange={(e) => setDeleteGroupType(e.target.value)}
          >
            <option value="">All</option>
            {deletegroupTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyFilter}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
};

export default GetDeleteFilterModal;
