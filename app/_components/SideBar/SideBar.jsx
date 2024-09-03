"use client";
import React, { useState } from 'react';
import {
  MdHome,
  MdPeople,
  MdGroup,
  MdSecurity,
  MdSettings,
  MdSupport,
  MdPayment,
  MdInsertDriveFile,
} from 'react-icons/md';
import { BsChevronDown } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import { LuChevronLast, LuChevronFirst } from "react-icons/lu";
import Link from 'next/link';

const Menus = [
  {
    title: 'Home',
    icon: <MdHome />,
    link: '/'
  },
  {
    title: 'Users',
    icon: <MdPeople />,
    link: '/users',
    subMenus: [
      { title: 'Active users', link: '/table-test' },
      { title: 'Contacts', link: '/users/contacts' },
      { title: 'Guest users', link: '/users/guest' },
      { title: 'Deleted users', link: '/users/deleteuser' },
    ],
  },
  {
    title: 'Groups',
    icon: <MdGroup />,
    link: '/group',
    subMenus: [
      { title: 'Active groups', link: '/group/ActiveGroups' },
      { title: 'Deleted groups', link: '/group/DeleteGroups' },
     
    ],
  },
  {
    title: 'Roles',
    icon: <MdSecurity />,
    link: '/roles'
  },
  {
    title: 'Resources',
    icon: <MdInsertDriveFile />,
    link: '/resources',
  },
  {
    title: 'Billing',
    icon: <MdPayment />,
    link: '/billing',
    subMenus: [
      { title: 'Purchase services', link: '/billing/purchase-services' },
      { title: 'Your products', link: '/billing/your-products' },
      { title: 'Licenses', link: '/billing/licenses' },
      { title: 'Bills & payments', link: '/billing/bills-payments' },
      { title: 'Billing accounts', link: '/billing/accounts' },
      { title: 'Payment methods', link: '/billing/payment-methods' },
      { title: 'Billing notifications', link: '/billing/notifications' },
    ],
  },
  {
    title: 'Support',
    icon: <MdSupport />,
    link: '/support',
  },
  {
    title: 'Settings',
    icon: <MdSettings />,
    link: '/settings',
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({});

  const toggleSidebar = () => setOpen(!open);
  const handleSubMenuToggle = (index) => {
    setSubMenuOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className="h-screen  sticky top-0 ">
      <div
        className={`${
          open ? 'w-48' : 'w-16'
        } bg-white h-full relative duration-500 border-r border-gray-300`}
      >
        <div className="p-4 flex justify-end items-center">
          <button
            className="text-gray-600 text-[20px]"
            onClick={toggleSidebar}
          >
            {open ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>
        <ul className="">
          {Menus.map((Menu, index) => (
            <div key={index}>
              <li
                className={`flex items-center p-2 cursor-pointer hover:bg-blue-200 text-gray-600 text-sm gap-x-4 ${
                  Menu.gap ? 'mt-9' : 'mt-2'
                }`}
                data-tooltip-id={index}
              >
                <Link href={Menu.link} passHref>
                  <div className="flex items-center gap-x-4">
                    <div className="flex-shrink-0 text-[20px] text-blue-500">{Menu.icon}</div>
                    <span
                      className={`${
                        open ? 'block text-sm' : 'hidden'
                      } flex-1 duration-300`}
                    >
                      {Menu.title}
                    </span>
                  </div>
                </Link>
                {Menu.subMenus && (
                  <BsChevronDown
                    onClick={() => handleSubMenuToggle(index)}
                    className={`ml-auto ${subMenuOpen[index] && 'rotate-180'} transition-all`}
                  />
                )}
              </li>
              {!open && <Tooltip  id={index.toString()}>{Menu.title}</Tooltip>}
              {Menu.subMenus && subMenuOpen[index] && open && (
                <ul>
                  {Menu.subMenus.map((subMenuItem, idx) => (
                    <Link href={subMenuItem.link} key={idx} passHref>
                      <li
                        key={idx}
                        className="flex px-5 cursor-pointer text-center text-sm text-gray-500 hover:bg-blue-200 py-1"
                      >
                        {subMenuItem.title}
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
