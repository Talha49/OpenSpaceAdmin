import { setSearchTerm } from "@/lib/Feature/UserSlice";
import React from "react";
import { FaFilter } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const NewHeader = ({ children }) => {
    const searchTerm = useSelector(state => state.user.searchTerm);
    const dispatch = useDispatch()
    console.log(searchTerm)
  return (
    <div className="gap-4 py-8 ">
      {children}
      {/* <div className="flex items-center gap-4 w-[250px]">
        <span className="flex items-center text-sm gap-1">
          <FaFilter />
          <p>Filter</p>
        </span>
        <input
          type="text"
          placeholder="Search users list"
            onChange={(e)=>{dispatch(setSearchTerm(e.target.value))}}
            value={searchTerm}
          className="w-full p-1 border border-gray-300 rounded placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div> */}
    </div>
  );
};

export default NewHeader;
