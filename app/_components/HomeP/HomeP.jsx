"use client";
import React, { useEffect, useState } from "react";
import {
  FaCheck,
  FaCircle,
  FaEllipsisH,
  FaUser,
  FaCode,
  FaUsers,
  FaUserLock,
} from "react-icons/fa";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { SlCursor } from "react-icons/sl";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchDeletedUsers, fetchUsers } from "@/lib/Feature/UserSlice";
import { ImSpinner3 } from "react-icons/im";
import UserActivityChart from "./_components/UserActivityChart";
import { fetchDeletedGroups, fetchGroups } from "@/lib/Feature/GroupSlice";
import { fetchAllRoles } from "@/lib/Feature/RoleSlice";

// Registering required components in Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HomeP = () => {
  const dispatch = useDispatch();
  const [deletedUsers, setDeletedUsers] = useState();
  const { users } = useSelector((state) => state.user);
  const { groups, deletedGroups } = useSelector((state) => state.group);
  const { roles } = useSelector((state) => state.role);
  // console.log("deletedUsers", deletedUsers);
  // console.log("activeUsers", users);
  // console.log("ActiveGroups", groups);
  // console.log("InactiveGroups", deletedGroups);
  // console.log(roles)

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchDeletedUsers()) // Dispatch the fetchDeletedUsers action immediately on mount
      .unwrap() // Unwrap the promise to handle success/failure
      .then((data) => {
        setDeletedUsers(data); // Update state with fetched data
      })
      .catch((error) => {
        console.error("❌ Error fetching deleted users:", error.message);
      });
    dispatch(fetchGroups());
    dispatch(fetchDeletedGroups());
    dispatch(fetchAllRoles());
  }, [dispatch]);

  // Sample data - replace with your actual data
  const stats = {
    users: {
      active: 234,
      inactive: 45,
    },
    groups: {
      active: 12,
      inactive: 3,
    },
    roles: {
      total: 8,
      custom: 3,
      default: 5,
    },
  };

  // Pie chart data for Active & Inactive Groups
  const groupsChartData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        data: [groups?.length, deletedGroups?.length],
        backgroundColor: ["#22C55E", "#F43F5E"], // Green and Rose colors
        hoverBackgroundColor: ["#16A34A", "#E11D48"], // Slightly darker shades for hover
        hoverOffset: 4,
        cutout: "70%",
      },
    ],
  };

  return (
    <div className="dark:bg-stone-950">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-neutral-400 text-neutral-900">
          Admin Center
        </h1>
        <p className="text-neutral-500 mt-2">
          Manage your organization&lsquo;s users, groups, and roles
        </p>
      </div>

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 gap-6">
        {/* Quick Actions */}
        <div className="shadow-md border dark:border-neutral-700 rounded-lg p-4">
          <h2 className="font-semibold text-xl flex items-center gap-2">
            <SlCursor className="text-blue-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <Link
              href="/users/main"
              className="flex flex-col items-center bg-blue-50 dark:bg-blue-500 dark:bg-opacity-10 border border-blue-500 text-blue-500 transition-all hover:scale-105 p-4 rounded-lg"
            >
              <FaUser className="text-3xl mb-2" />
              <span>Manage Users</span>
            </Link>
            <Link
              href="/group/main"
              className="flex flex-col items-center bg-green-50 dark:bg-green-500 dark:bg-opacity-10 border border-green-500 transition-all text-green-500 hover:scale-105 p-4 rounded-lg"
            >
              <FaUsers className="text-3xl mb-2" />
              <span>Manage Groups</span>
            </Link>
            <Link
              href="/roles"
              className="flex flex-col items-center bg-rose-50 dark:bg-rose-500 dark:bg-opacity-10 border border-rose-500 transition-all text-rose-500 hover:scale-105 p-4 rounded-lg"
            >
              <FaUserLock className="text-3xl mb-2" />
              <span>Manage Roles</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Stats */}
          <div className="dark:bg-neutral-950 border dark:border-neutral-700 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaUser className="text-blue-600" />
              <h2 className="text-xl font-semibold">Users</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center text-center p-4 bg-green-50 dark:bg-green-500 dark:bg-opacity-10 border border-green-500 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {users?.length || <ImSpinner3 className="animate-spin" />}
                </div>
                <div className="text-sm text-green-600">Active</div>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-rose-50 dark:bg-rose-500 dark:bg-opacity-10 border border-rose-500 rounded-lg">
                <div className="text-2xl font-bold text-rose-600">
                  {deletedUsers?.length || (
                    <ImSpinner3 className="animate-spin" />
                  )}
                </div>
                <div className="text-sm text-rose-600">Inactive</div>
              </div>
            </div>
          </div>

          {/* Users Chart */}
          <div className="md:col-span-2 lg:col-span-2 border dark:border-neutral-700 shadow-md rounded-lg p-4">
            <UserActivityChart
              activeUsers={users}
              inactiveUsers={deletedUsers}
            />
          </div>

          {/* Groups Stats */}
          <div className="dark:bg-neutral-950 border dark:border-neutral-700 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaUsers className="text-blue-600 text-xl" />
              <h2 className="text-xl font-semibold">Groups</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center justify-center text-center p-4 bg-green-50 dark:bg-green-500 dark:bg-opacity-10 border border-green-500 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {groups?.length || <ImSpinner3 className="animate-spin" />}
                </div>
                <div className="text-sm text-green-600">Active</div>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 bg-rose-50 dark:bg-rose-500 dark:bg-opacity-10 border border-rose-500 rounded-lg">
                <div className="text-2xl font-bold text-rose-600">
                  {deletedGroups?.length || (
                    <ImSpinner3 className="animate-spin" />
                  )}
                </div>
                <div className="text-sm text-rose-600">Inactive</div>
              </div>
            </div>
          </div>

          {/* Groups Chart */}
          <div className="border dark:border-neutral-700 shadow-md rounded-lg p-4">
            <Pie
              data={groupsChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
              height={250}
            />
          </div>

          {/* Roles Stats */}
          <div className="dark:bg-neutral-950 border dark:border-neutral-700 rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaUserLock className="text-yellow-500 text-lg" />
              <h2 className="text-xl font-semibold">Roles</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* Total Roles Card */}
              <div className="flex flex-col items-center justify-center gap-3 text-center p-3 bg-blue-50 dark:bg-blue-500 dark:bg-opacity-10 border border-blue-500 rounded-lg shadow-md">
                <div className="text-6xl font-bold text-blue-600">
                  {roles?.length || (
                    <ImSpinner3 className="animate-spin text-4xl text-blue-400" />
                  )}
                </div>
                <div className="text-lg text-neutral-600 dark:text-neutral-400">
                  Total Roles
                </div>
              </div>

              {/* View All Button */}
              <Link
                href="/roles"
                className="flex items-center justify-center h-12 p-2 bg-blue-500 hover:bg-blue-600 transition-all dark:bg-opacity-30 rounded-lg shadow-md text-white"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeP;
