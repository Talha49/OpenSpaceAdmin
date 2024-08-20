"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const GroupDetailDialog = ({ group, isOpen, onClose }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showMembers, setShowMembers] = useState(false);


  return (
    <Transition
      show={isOpen}
      enter="transition-transform duration-300 ease-in-out"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transition-transform duration-300 ease-in-out"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
      className="fixed top-[4rem] right-0 h-screen z-50"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md h-full overflow-y-auto fixed top-0 right-0 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Group Details</h2>
          <button
            onClick={() => {
              onClose();
              setShowDetail(false);
              setShowMembers(false);
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">{group?.basics.name}</h1>
            <span className="text-sm bg-blue-500 px-3 py-1 rounded-full text-white">
              {group?.groupType}
            </span>
          </div>
          <div className='bg-gray-300 p-2 rounded-lg my-5 flex items-center gap-4 text-white'>
            <span className='px-2 py-1 rounded-full bg-gray-500'>Owner</span>
            <span className='px-2 py-1 rounded-full bg-gray-500'>{group?.owners[0]?.fullName}</span>
          </div>
          <div className="my-5">
            <h1
              className={`flex items-center justify-between text-xl bg-gray-300 py-2 px-4 ${
                showDetail ? "rounded-t-lg" : "rounded-lg"
              } border cursor-pointer`}
              onClick={() => {
                setShowDetail(!showDetail);
              }}
            >
              Description
              <span>
                <IoIosArrowDown
                  className={`${showDetail && "rotate-180"} transition-all`}
                />
              </span>
            </h1>
            {showDetail && (
              <p
                className={`text-gray-600 p-2 bg-gray-100 ${
                  showDetail ? "rounded-b-lg" : "rounded-lg"
                }`}
              >
                {group?.basics.description}
              </p>
            )}
          </div>
          <div className="my-5">
            <h1
              className={`flex items-center justify-between text-xl bg-gray-300 py-2 px-4 ${
                showMembers ? "rounded-t-lg" : "rounded-lg"
              } border cursor-pointer`}
              onClick={() => {
                setShowMembers(!showMembers);
              }}
            >
              Members
              <span>
                <IoIosArrowDown
                  className={`${showMembers && "rotate-180"} transition-all`}
                />
              </span>
            </h1>
            {showMembers && (
              <p
                className={`text-gray-600 p-2 bg-gray-100 ${
                  showMembers ? "rounded-b-lg" : "rounded-lg"
                }`}
              >
                {group?.members.map((member) => (
                  <div key={member.id} className=" p-2 border my-1 rounded-lg bg-gray-200 hover:bg-gray-400">
                    <div className="flex items-center justify-between gap-4">
                      <p>{member.fullName}</p>
                      <p>{member.email}</p>
                    </div>
                  </div>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default GroupDetailDialog;
