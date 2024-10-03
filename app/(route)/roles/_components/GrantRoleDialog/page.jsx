import React, { useState } from "react";
import PermissionDialog from "../PermissionDialog/page";
import Image from "next/image";

const GrantRoleDialog = ({ onClose }) => {
  return (
    <PermissionDialog onClose={onClose}>
      <div
        className="flex items-center gap-2 absolute top-3 left-3 text-blue-500 cursor-pointer"
        onClick={onClose}
      >
        <span className="flex items-center justify-center bg-blue-100 w-8 h-8 rounded-full hover:bg-blue-200 transition-all">
          {"<-"}
        </span>
        <span className="text-sm">Permission Role Details</span>
      </div>
      <div className="text-center bg-gray-200 rounded border mt-10">
        <h1 className="text-lg font-semibold p-2">Grant This Role To...</h1>
      </div>
      <div className="my-2">
        <h1 className="font-bold">
          1. Define whome you want to grant this role permission to.
        </h1>
        <div className="flex gap-3 my-4">
          <div className="px-10">
            <Image src="/images/add-user.gif" width={100} height={100} />
          </div>
          <div className="flex flex-col">
            <label>Grant Role To</label>
            <select className="w-[350px] px-2 py-1 mt-1 outline focus:outline-2 outline-blue-500 rounded-lg">
              <option value="managers">Managers</option>
            </select>
            <div className="flex items-center gap-2 my-2">
              <input type="radio" id="all-managers" />
              <label htmlFor="all-managers">All Mangers</label>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input type="radio" id="only-managers" />
              <label htmlFor="only-managers">
                Only the Mangers in these Groups below:
              </label>
            </div>
            <select className="w-[350px] px-2 py-1 mt-1 outline focus:outline-2 outline-blue-500 rounded-lg">
              <option value="group 1">Group 1</option>
              <option value="group 2">Group 2</option>
              <option value="group 3">Group 3</option>
            </select>
            <div className="flex items-center gap-2 my-2">
              <input type="checkbox" id="only-managers" />
              <label htmlFor="only-managers">
                Allow their Managers to have the same permission access
              </label>
            </div>
          </div>
        </div>
        <div className="w-full h-[2px] bg-gray-200"></div>
        <h1 className="font-bold">
          2. Specify the target population whome the above granted users have
          permisssion to access.
        </h1>
        <div className="flex gap-3 my-4">
          <div className="px-10">
            <Image src="/images/group.gif" width={100} height={100} />
          </div>
          <div className="flex flex-col">
            <label>Target Population</label>
            <div className="flex items-center gap-2 my-2">
              <input type="radio" id="reports" />
              <label htmlFor="reports">Granted User's Direct Reports</label>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input type="radio" id="only-reports" />
              <label htmlFor="only-reports">
                Only the Direct Reports in these Groups below:
              </label>
            </div>
            <select className="w-[350px] px-2 py-1 mt-1 outline focus:outline-2 outline-blue-500 rounded-lg">
              <option value="group 1">Group 1</option>
              <option value="group 2">Group 2</option>
              <option value="group 3">Group 3</option>
            </select>
            <div className="flex items-center gap-2 my-2">
              <input type="checkbox" />
              <label>
                Include access to the reports of the Granted User's Direct
                Reports
              </label>
            </div>
            <div className="w-full flex justify-between items-center gap-10 my-2">
              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <label>Include access to the Granted User (Self)</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" />
                <label>Exclude Granted Users from</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PermissionDialog>
  );
};

export default GrantRoleDialog;
