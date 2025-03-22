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
  MdOutlineSubdirectoryArrowRight,
} from "react-icons/md";
import { BsChevronDown } from "react-icons/bs";
import { Tooltip } from "react-tooltip";
import Link from "next/link";
import { IoMdMenu } from "react-icons/io";
import { CiLock, CiUnlock } from "react-icons/ci";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { toggleLockSidebar } from "@/lib/Feature/LockSidebarSlice";

const Menus = [
  {
    title: "Home",
    icon: <MdHome />,
    link: "/",
  },
  {
    title: "Users",
    icon: <MdPeople />,
    link: "/users/main",
    subMenus: [
      { title: "Create", link: "/users" },
      { title: "Active users", link: "/users/active" },
      { title: "Deleted users", link: "/users/deleted" },
    ],
  },
  {
    title: "Groups",
    icon: <MdGroup />,
    link: "/group/main",
    subMenus: [
      { title: "Create", link: "/group" },
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

const Sidebar = ({ className }) => {
  const [open, setOpen] = useState(true);
  const [subMenuOpen, setSubMenuOpen] = useState({});
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const dispatch = useDispatch();
  const { locked } = useSelector((state) => state.lock);

  // Check screen size and update state
  useEffect(() => {
    const checkScreenSize = () => {
      const smallScreen = window.innerWidth < 640; // small screens considered below 640px (tailwind sm breakpoint)
      setIsSmallScreen(smallScreen);
      
      // Only update lock state if screen size changes to small
      if (smallScreen && locked) {
        dispatch(toggleLockSidebar());
      }
    };

    // Run initially
    checkScreenSize();
    
    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [dispatch, locked]); // Add dependencies

  const handleSubMenuToggle = (index) => {
    setSubMenuOpen((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleMouseEnter = () => {
    if (!isSmallScreen && !locked) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isSmallScreen && !locked) {
      setOpen(false);
    }
  };

  const toggleLock = () => {
    dispatch(toggleLockSidebar());
    if (!locked) {
      setOpen(true);
    }
  };

  return (
    <div
      className={`h-full fixed top-[60px] z-10`}
      onMouseEnter={!locked ? handleMouseEnter : undefined}
      onMouseLeave={!locked ? handleMouseLeave : undefined}
    >
      <button
        onClick={toggleLock}
        className={`${
          isSmallScreen ? "hidden" : ""
        } absolute top-2 right-2 z-50 p-2 rounded-full bg-blue-100 dark:bg-neutral-800 text-blue-500 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-neutral-700 transition-all duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        aria-label={locked ? "Unlock sidebar" : "Lock sidebar"}
      >
        {locked ? <CiUnlock size={20} /> : <CiLock size={20} />}
      </button>
      <div
        className={`${
          open ? "w-64" : "w-16"
        } bg-white dark:bg-neutral-950 h-full overflow-x-hidden overflow-y-auto relative duration-200 shadow-md border-r border-t dark:border-neutral-800 custom-scrollbar`}
      >
        <ul>
          {/* Hamburger Menu for small screens */}
          <li
            className="p-2 px-5 my-2 w-6 h-6 text-xl text-blue-500 block sm:hidden cursor-pointer"
            onClick={() => {
              if (isSmallScreen) {
                toggleLock();
                setOpen(!open);
              }
            }}
          >
            <IoMdMenu />
          </li>

          {Menus.map((Menu, index) => (
            <div key={index}>
              <li
                className={`flex items-center cursor-pointer px-5 hover:bg-blue-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-400 text-sm gap-x-4 ${
                  Menu.gap ? "mt-9" : "mt-2"
                }`}
                data-tooltip-id={index.toString()}
              >
                <Link href={Menu?.link || ""} passHref className="py-2 w-full">
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
                      subMenuOpen[index] ? "rotate-180" : ""
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
                        className="flex gap-1 pl-14 min-w-48 cursor-pointer text-center text-sm text-neutral-800 dark:text-neutral-400 hover:bg-blue-200 dark:hover:bg-neutral-700 py-1"
                      >
                        <MdOutlineSubdirectoryArrowRight className="text-lg text-blue-500" />
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