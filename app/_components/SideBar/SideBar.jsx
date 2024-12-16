"use client";
import React, { useState, useEffect } from "react";
import {
  MdHome,
  MdPeople,
  MdGroup,
  MdSecurity,
  MdSettings,
  MdSupport,
  MdPayment,
  MdInsertDriveFile,
} from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { IoMdMenu } from "react-icons/io";

const Menus = [
  {
    title: "Home",
    icon: <MdHome />,
    link: "/",
  },
  {
    title: "Users",
    icon: <MdPeople />,
    link: "/users",
    subMenus: [
      { title: "Active users", link: "/users/active" },
      { title: "Contacts", link: "/users/contacts" },
     // { title: "Guest users", link: "/users/guest" },//remove on sir send error ppt file 
      { title: "Deleted users", link: "/users/deleted" },
    ],
  },
  {
    title: "Groups",
    icon: <MdGroup />,
    link: "/group",
    subMenus: [
      { title: "Active groups", link: "/group/ActiveGroups" },
      { title: "Deleted groups", link: "/group/DeleteGroups" },
    ],
  },
  {
    title: "Roles",
    icon: <MdSecurity />,
    link: "/roles",
  },
  {
    title: "Resources",
    icon: <MdInsertDriveFile />,
    link: "/resources",
  },
  {
    title: "Billing",
    icon: <MdPayment />,
    link: "/billing",
    subMenus: [
      { title: "Purchase services", link: "/billing/purchase-services" },
      { title: "Your products", link: "/billing/your-products" },
      { title: "Licenses", link: "/billing/licenses" },
      { title: "Bills & payments", link: "/billing/bills-payments" },
      { title: "Billing accounts", link: "/billing/accounts" },
      { title: "Payment methods", link: "/billing/payment-methods" },
      { title: "Billing notifications", link: "/billing/notifications" },
    ],
  },
  {
    title: "Support",
    icon: <MdSupport />,
    link: "/support",
  },
  {
    title: "Settings",
    icon: <MdSettings />,
    link: "/settings",
  },
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size and update state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 640); // small screens considered below 640px (tailwind sm breakpoint)
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleSubMenuToggle = (index) => {
    setSubMenuOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleMouseEnter = () => {
    if (!isSmallScreen) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSmallScreen) {
      setOpen(false);
    }
  };

  return (
    <div
      className="h-full fixed top-[60px] z-10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${
          open ? "w-56" : "w-16"
        } bg-white dark:bg-neutral-950 h-full overflow-x-hidden overflow-y-auto relative duration-200 shadow-md border-r border-t dark:border-neutral-800 custom-scrollbar`}
      >
        <ul>
          {/* Hamburger Menu for small screens */}
          <li
            className="p-2 px-5 my-2 w-6 h-6 text-xl text-blue-500 block sm:hidden cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <IoMdMenu />
          </li>

          {Menus.map((Menu, index) => (
            <div key={index}>
              <li
                className={`flex items-center p-2 px-5 cursor-pointer hover:bg-blue-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-400 text-sm gap-x-4 ${
                  Menu.gap ? "mt-9" : "mt-2"
                }`}
                data-tooltip-id={index}
              >
                <Link href={Menu.link} passHref>
                  <div className="flex items-center gap-x-4">
                    <div className="flex-shrink-0 text-[20px] text-blue-500">
                      {Menu.icon}
                    </div>
                    <span
                      className={`${
                        open ? "block text-sm" : "hidden"
                      } flex-1 duration-300`}
                    >
                      {Menu.title}
                    </span>
                  </div>
                </Link>
                {Menu.subMenus && open && (
                  <BsChevronDown
                    onClick={() => handleSubMenuToggle(index)}
                    className={`ml-auto ${
                      subMenuOpen[index] && "rotate-180"
                    } transition-all`}
                  />
                )}
              </li>

              {!open && <Tooltip id={index.toString()}>{Menu.title}</Tooltip>}

              {Menu.subMenus && subMenuOpen[index] && open && (
                <ul>
                  {Menu.subMenus.map((subMenuItem, idx) => (
                    <Link href={subMenuItem.link} key={idx} passHref>
                      <li
                        key={idx}
                        className="flex px-5 min-w-48 cursor-pointer text-center text-sm text-neutral-800 dark:text-neutral-400 hover:bg-blue-200 dark:hover:bg-neutral-700 py-1"
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
