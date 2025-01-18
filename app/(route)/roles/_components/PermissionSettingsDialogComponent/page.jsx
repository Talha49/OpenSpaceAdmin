import React, { useEffect, useState } from "react";
import {
  IoMdArrowBack,
  IoIosArrowDown,
  IoIosArrowDropright,
} from "react-icons/io";
import { CiMenuFries } from "react-icons/ci";
import PermissionDialog from "../PermissionDialog/page";
import { HiOutlineDocumentReport } from "react-icons/hi";

// Import JSON data
import menuData from "../../_components/Menu.json";
import adminMenuData from "../../_components/AdminMenu.json";
import formData from "../../_components/Form.json";
import reportData from "../../_components/Report.json";
import wrokflowData from "../../_components/Workflow.json";
import {
  MdExpandMore,
  MdOutlineSecurity,
  MdOutlineSubdirectoryArrowRight,
} from "react-icons/md";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setStatePermissions } from "@/lib/Feature/RoleSlice";

const PermissionSettingsDialog = ({ onClose }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({}); // Track expanded menus by ID
  const [expandedForms, setExpandedForms] = useState({}); // Track expanded form pages
  const [expandedTabs, setExpandedTabs] = useState({}); // Track expanded tabs in Form Permissions
  const [expandedSections, setExpandedSections] = useState({}); // Track expanded sections
  const [selectedContent, setSelectedContent] = useState(null);
  const [menuAccordion, setMenuAccordion] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openMenuIndex, setOpenMenuIndex] = useState(null); // Track which menu is open
  const [openReportId, setOpenReportId] = useState(null); // State to track which report is expanded
  const [active, setActive] = useState(null);
  const [permissions, setPermissions] = useState(() => {
    // Try to load the permissions from localStorage
    const savedState = localStorage.getItem("permissions");

    if (savedState) {
      // Parse the saved state if it exists
      return JSON.parse(savedState);
    }

    // If no saved state, return the default structure
    return {
      menuPermissions: {
        basicMenu: menuData.map((menu) => ({
          id: menu.menuId,
          name: menu.name,
          included: false,
          path: menu.path,
          permission: [],
          submenus: menu.submenus
            ? menu.submenus.map((submenu) => ({
                id: submenu.id,
                name: submenu.name,
                included: false,
                path: submenu.path,
                permission: [],
              }))
            : [],
        })),
        adminMenu: adminMenuData.map((menu) => ({
          id: menu.menuId,
          name: menu.name,
          included: false,
          path: menu.path,
          permission: [],
          submenus: menu.submenus
            ? menu.submenus.map((submenu) => ({
                id: submenu.id,
                name: submenu.name,
                included: false,
                path: submenu.path,
                permission: [],
              }))
            : [],
        })),
      },
      formPermissions: formData.map((page) => ({
        name: page.pageName,
        tabs: page.tabs.map((tab) => ({
          name: tab.tabName,
          view: false,
          sections: tab.sections.map((section) => ({
            name: section.sectionName,
            view: false,
            fields: section.fields.map((field) => ({
              name: field.fieldName,
              permission: "edit",
            })),
          })),
        })),
      })),
      reportPermissions: reportData.map((report) => ({
        id: report.reportId,
        name: report.reportName,
        included: false,
        subReports: report.subReports.map((subReport) => ({
          id: subReport.reportId,
          name: subReport.reportName,
          included: false,
          view: false,
          export: false,
          generate: false,
        })),
      })),
      workflowPermissions: wrokflowData.map((diagram) => ({
        name: diagram.name,
        create: false,
        view: false,
        edit: false,
        delete: false,
      })),
    };
  });

  // Effect to save permissions to localStorage when the permissions state changes
  useEffect(() => {
    localStorage.setItem("permissions", JSON.stringify(permissions));
  }, [permissions]);
  const dispatch = useDispatch();
  const [formIndex, setFormIndex] = useState(null);

  useEffect(() => {
    dispatch(setStatePermissions(permissions));
  }, [permissions, dispatch]);

  const role = useSelector((state) => state.role);

  console.log("Permissions =>", permissions);
  console.log("Role =>", role);

  // Handle checkbox change (View, etc.)
  const handleCheckboxChange = (path, checked) => {
    const updatedPermissions = { ...permissions };
    const keys = path.split("."); // Path to access nested properties

    let obj = updatedPermissions;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        obj[key] = checked;
      } else {
        obj[key] = { ...obj[key] };
        obj = obj[key];
      }
    });

    setPermissions(updatedPermissions);
  };

  // Handle radio button change (Readonly, Edit, Hidden)
  const handleRadioChange = (path, value) => {
    const updatedPermissions = { ...permissions };
    const keys = path.split("."); // Path to access nested properties

    let obj = updatedPermissions;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        obj[key] = value;
      } else {
        obj[key] = { ...obj[key] };
        obj = obj[key];
      }
    });

    setPermissions(updatedPermissions);
  };

  const handleCheckboxChangeForWorkflowPermissions = (
    index,
    field,
    checked
  ) => {
    const updatedPermissions = [...permissions.workflowPermissions];

    // Create a deep copy of the object at the given index
    const updatedDiagram = { ...updatedPermissions[index] };

    // Update the property on the copied object
    updatedDiagram[field] = checked;

    // Replace the old object with the updated object
    updatedPermissions[index] = updatedDiagram;

    // Update the state
    setPermissions({
      ...permissions,
      workflowPermissions: updatedPermissions,
    });
  };

  const toggleReport = (reportId) => {
    setOpenReportId(openReportId === reportId ? null : reportId); // Toggle the report visibility
  };

  const toggleMenu = (index) => {
    if (openMenuIndex === index) {
      setOpenMenuIndex(null); // Close if the same menu is clicked again
    } else {
      setOpenMenuIndex(index); // Open the clicked menu
    }
  };

  return (
    <PermissionDialog
      onClose={onClose}
      classes={"max-w-[1000px] min-h-[450px] max-h-[450px]"}
    >
      <div
        className="flex items-center gap-2 absolute top-3 left-3 text-blue-500 cursor-pointer"
        onClick={onClose}
      >
        <span className="flex items-center justify-center bg-blue-100 dark:bg-neutral-800 w-8 h-8 rounded-full hover:bg-blue-200 dark:hover:bg-neutral-700 transition-all">
          <IoMdArrowBack />
        </span>
        <span className="text-sm">Permission Role Details</span>
      </div>

      <div className="text-center mt-6">
        <h1 className="text-xl font-semibold dark:text-neutral-500">
          Permission Settings
        </h1>
        <p className="dark:text-neutral-700">
          Specify what permissions users in this role should have.
        </p>
      </div>

      <div
        className="flex items-center gap-2 w-fit my-1 text-blue-500 cursor-pointer"
        onClick={() => {
          setIsSidebarOpen(!isSidebarOpen);
        }}
      >
        <span className="flex items-center justify-center bg-blue-100 dark:bg-neutral-800 w-8 h-8 rounded-lg hover:bg-blue-200 transition-all">
          <CiMenuFries />
        </span>
      </div>

      <div className="flex gap-2">
        <div
          className={`w-[350px] h-[350px] custom-scrollbar py-2 overflow-y-auto bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 lg:static absolute z-50 ${
            !isSidebarOpen && "hidden"
          }`}
        >
          <div
            className={`flex gap-2 items-center font-bold cursor-pointer py-1 px-2 ${
              active === "Menu Permissions" &&
              "bg-neutral-200 dark:bg-neutral-900/50"
            }`}
            onClick={() => {
              setSelectedItem("menu");
              setActive("Menu Permissions");
              setSelectedContent(menuData);
            }}
          >
            Menu Permissions
          </div>
          <div
            className="flex gap-2 items-center font-bold cursor-pointer py-1 px-2"
            onClick={() => {
              setSelectedItem("form");
              setSelectedContent(null);
              setMenuAccordion(menuAccordion === "form" ? null : "form");
            }}
          >
            {menuAccordion === "form" ? (
              <IoIosArrowDown className="rotate-180 transition-all" />
            ) : (
              <IoIosArrowDown className="transition-all" />
            )}
            Form Permissions
          </div>
          {menuAccordion === "form" &&
            formData.map((page, index) => (
              <div key={page.pageId} className="ml-4">
                <div
                  className={`cursor-pointer flex items-center gap-2 p-1 ml-7 hover:bg-neutral-200 hover:dark:bg-neutral-900/50 ${
                    active === page.pageName &&
                    "bg-neutral-200 dark:bg-neutral-900/50"
                  }`}
                  onClick={() => {
                    setSelectedContent(page);
                    setSelectedItem("page");
                    setActive(page.pageName);
                    setFormIndex(index);
                    // toggleFormExpansion(page.pageId);
                  }}
                >
                  {/* {expandedForms[page.pageId] ? (
            <IoIosArrowDown />
          ) : (
            <IoIosArrowDropright />
          )} */}
                  {page.pageName}
                </div>
              </div>
            ))}

          <div
            className={`flex gap-2 items-center font-bold cursor-pointer py-1 px-2 ${
              active === "Report Permissions" &&
              "bg-neutral-200 dark:bg-neutral-900/50"
            }`}
            onClick={() => {
              setSelectedItem("report");
              setActive("Report Permissions");
              setSelectedContent(reportData);
            }}
          >
            Report Permissions
          </div>

          <div
            className={`flex gap-2 items-center font-bold cursor-pointer py-1 px-2 ${
              active === "Workflow Permissions" &&
              "bg-neutral-200 dark:bg-neutral-900/50"
            }`}
            onClick={() => {
              setSelectedItem("workflow");
              setActive("Workflow Permissions");
              setSelectedContent(wrokflowData);
            }}
          >
            Workflow Permissions
          </div>
        </div>

        <div className="w-full rounded border-neutral-300">
          {selectedContent && selectedItem && (
            <div className="h-[350px] overflow-y-auto custom-scrollbar">
              <h2 className="text-lg font-semibold p-2 sticky top-0 bg-white dark:bg-neutral-900 z-10">
                {selectedItem === "menu" && "Menu Permissions"}
                {(selectedItem === "form" ||
                  selectedItem === "page" ||
                  selectedItem === "tab" ||
                  selectedItem === "section") &&
                  "Form Permissions"}
                {selectedItem === "report" && "Report Permissions"}
                {selectedItem === "workflow" && "Workflow Permissions"}
              </h2>
              {selectedContent && selectedItem && (
                <div className=" py-1">
                  {selectedItem === "menu" && (
                    <div className="px-2 space-y-3">
                      <h1 className="text-lg text-center font-semibold">
                        Basic Permissions
                      </h1>
                      {menuData.map((menu, index) => (
                        <div key={index} className="border p-2 rounded-lg">
                          <div className="flex items-center gap-2">
                            {menu.submenus && (
                              <FaArrowRight onClick={() => toggleMenu(index)} />
                            )}
                            <input
                              type="checkbox"
                              checked={
                                permissions.menuPermissions.basicMenu[index]
                                  ?.included
                              }
                              onChange={() => {
                                const updatedPermissions =
                                  permissions.menuPermissions.basicMenu.map(
                                    (menuItem, i) => {
                                      if (i === index) {
                                        const included = !menuItem.included;
                                        return {
                                          ...menuItem,
                                          included,
                                          submenus: menuItem.submenus.map(
                                            (submenu) => ({
                                              ...submenu,
                                              included,
                                            })
                                          ),
                                        };
                                      }
                                      return menuItem;
                                    }
                                  );
                                setPermissions((prev) => ({
                                  ...prev,
                                  menuPermissions: {
                                    ...prev.menuPermissions,
                                    basicMenu: updatedPermissions,
                                  },
                                }));
                              }}
                            />
                            {menu.name}
                          </div>
                          <div className="flex gap-4 ml-9">
                            {["create", "view", "edit", "delete"].map(
                              (permission) => (
                                <label
                                  key={permission}
                                  className="flex items-center gap-1"
                                >
                                  <input
                                    type="checkbox"
                                    disabled={
                                      !permissions.menuPermissions.basicMenu[
                                        index
                                      ]?.included
                                    }
                                    checked={permissions.menuPermissions.basicMenu[
                                      index
                                    ]?.permission.includes(permission) && permissions.menuPermissions.basicMenu[
                                      index
                                    ]?.included}
                                    onChange={() => {
                                      const updatedPermissions =
                                        permissions.menuPermissions.basicMenu.map(
                                          (menuItem, i) => {
                                            if (i === index) {
                                              const newPermissions =
                                                menuItem.permission.includes(
                                                  permission
                                                )
                                                  ? menuItem.permission.filter(
                                                      (perm) =>
                                                        perm !== permission
                                                    )
                                                  : [
                                                      ...menuItem.permission,
                                                      permission,
                                                    ];
                                              return {
                                                ...menuItem,
                                                permission: newPermissions,
                                              };
                                            }
                                            return menuItem;
                                          }
                                        );
                                      setPermissions((prev) => ({
                                        ...prev,
                                        menuPermissions: {
                                          ...prev.menuPermissions,
                                          basicMenu: updatedPermissions,
                                        },
                                      }));
                                    }}
                                  />
                                  {permission.charAt(0).toUpperCase() +
                                    permission.slice(1)}
                                </label>
                              )
                            )}
                          </div>
                          {openMenuIndex === index &&
                            menu.submenus &&
                            menu.submenus.map((submenu, subIndex) => (
                              <div key={subIndex} className="ml-4">
                                <div className="flex items-center gap-2">
                                  <MdOutlineSubdirectoryArrowRight />
                                  <input
                                    type="checkbox"
                                    checked={
                                      permissions.menuPermissions.basicMenu[
                                        index
                                      ]?.submenus[subIndex]?.included
                                    }
                                    onChange={() => {
                                      const updatedPermissions =
                                        permissions.menuPermissions.basicMenu.map(
                                          (menuItem, i) => {
                                            if (i === index) {
                                              const updatedSubmenus =
                                                menuItem.submenus.map(
                                                  (submenuItem, j) => {
                                                    if (j === subIndex) {
                                                      return {
                                                        ...submenuItem,
                                                        included:
                                                          !submenuItem.included,
                                                      };
                                                    }
                                                    return submenuItem;
                                                  }
                                                );
                                              const parentIncluded =
                                                updatedSubmenus.some(
                                                  (sub) => sub.included
                                                );
                                              return {
                                                ...menuItem,
                                                included: parentIncluded,
                                                submenus: updatedSubmenus,
                                              };
                                            }
                                            return menuItem;
                                          }
                                        );
                                      setPermissions((prev) => ({
                                        ...prev,
                                        menuPermissions: {
                                          ...prev.menuPermissions,
                                          basicMenu: updatedPermissions,
                                        },
                                      }));
                                    }}
                                  />
                                  {submenu.name}
                                </div>
                                <div className="flex gap-4 ml-10">
                                  {["create", "view", "edit", "delete"].map(
                                    (permission) => (
                                      <label
                                        key={permission}
                                        className="flex items-center gap-1"
                                      >
                                        <input
                                          type="checkbox"
                                          disabled={
                                            !permissions.menuPermissions
                                              .basicMenu[index]?.submenus[
                                              subIndex
                                            ]?.included
                                          }
                                          checked={permissions.menuPermissions.basicMenu[
                                            index
                                          ]?.submenus[
                                            subIndex
                                          ]?.permission.includes(permission)}
                                          onChange={() => {
                                            const updatedPermissions =
                                              permissions.menuPermissions.basicMenu.map(
                                                (menuItem, i) => {
                                                  if (i === index) {
                                                    const updatedSubmenus =
                                                      menuItem.submenus.map(
                                                        (submenuItem, j) => {
                                                          if (j === subIndex) {
                                                            const newPermissions =
                                                              submenuItem.permission.includes(
                                                                permission
                                                              )
                                                                ? submenuItem.permission.filter(
                                                                    (perm) =>
                                                                      perm !==
                                                                      permission
                                                                  )
                                                                : [
                                                                    ...submenuItem.permission,
                                                                    permission,
                                                                  ];
                                                            return {
                                                              ...submenuItem,
                                                              permission:
                                                                newPermissions,
                                                            };
                                                          }
                                                          return submenuItem;
                                                        }
                                                      );
                                                    return {
                                                      ...menuItem,
                                                      submenus: updatedSubmenus,
                                                    };
                                                  }
                                                  return menuItem;
                                                }
                                              );
                                            setPermissions((prev) => ({
                                              ...prev,
                                              menuPermissions: {
                                                ...prev.menuPermissions,
                                                basicMenu: updatedPermissions,
                                              },
                                            }));
                                          }}
                                        />
                                        {permission.charAt(0).toUpperCase() +
                                          permission.slice(1)}
                                      </label>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                      <h1 className="text-xl text-center font-semibold">
                        Admin Permissions
                      </h1>
                      {adminMenuData.map((menu, index) => (
                        <div key={index} className="border p-2 rounded-lg">
                          <div className="flex items-center gap-2 text-blue-600 text-lg">
                            {menu.submenus && (
                              <FaArrowRight onClick={() => toggleMenu(index)} />
                            )}
                            <input
                              type="checkbox"
                              checked={
                                permissions.menuPermissions.adminMenu[index]
                                  ?.included
                              }
                              onChange={() => {
                                const updatedPermissions =
                                  permissions.menuPermissions.adminMenu.map(
                                    (menuItem, i) => {
                                      if (i === index) {
                                        const included = !menuItem.included;
                                        return {
                                          ...menuItem,
                                          included,
                                          submenus: menuItem.submenus.map(
                                            (submenu) => ({
                                              ...submenu,
                                              included,
                                            })
                                          ),
                                        };
                                      }
                                      return menuItem;
                                    }
                                  );
                                setPermissions((prev) => ({
                                  ...prev,
                                  menuPermissions: {
                                    ...prev.menuPermissions,
                                    adminMenu: updatedPermissions,
                                  },
                                }));
                              }}
                            />
                            {menu.name}
                          </div>
                          <div className="flex gap-4 ml-9">
                            {["create", "view", "edit", "delete"].map(
                              (permission) => (
                                <label
                                  key={permission}
                                  className="flex items-center gap-1"
                                >
                                  <input
                                    type="checkbox"
                                    disabled={
                                      !permissions.menuPermissions.adminMenu[
                                        index
                                      ]?.included
                                    }
                                    checked={permissions.menuPermissions.adminMenu[
                                      index
                                    ]?.permission.includes(permission)}
                                    onChange={() => {
                                      const updatedPermissions =
                                        permissions.menuPermissions.adminMenu.map(
                                          (menuItem, i) => {
                                            if (i === index) {
                                              const newPermissions =
                                                menuItem.permission.includes(
                                                  permission
                                                )
                                                  ? menuItem.permission.filter(
                                                      (perm) =>
                                                        perm !== permission
                                                    )
                                                  : [
                                                      ...menuItem.permission,
                                                      permission,
                                                    ];
                                              return {
                                                ...menuItem,
                                                permission: newPermissions,
                                              };
                                            }
                                            return menuItem;
                                          }
                                        );
                                      setPermissions((prev) => ({
                                        ...prev,
                                        menuPermissions: {
                                          ...prev.menuPermissions,
                                          adminMenu: updatedPermissions,
                                        },
                                      }));
                                    }}
                                  />
                                  {permission.charAt(0).toUpperCase() +
                                    permission.slice(1)}
                                </label>
                              )
                            )}
                          </div>
                          {openMenuIndex === index &&
                            menu.submenus &&
                            menu.submenus.map((submenu, subIndex) => (
                              <div
                                key={subIndex}
                                className="ml-4 bg-blue-100 rounded-lg my-2 p-2"
                              >
                                <div className="flex items-center gap-2 text-blue-600">
                                  <MdOutlineSubdirectoryArrowRight className="text-lg text-blue-600" />
                                  <input
                                    type="checkbox"
                                    checked={
                                      permissions.menuPermissions.adminMenu[
                                        index
                                      ]?.submenus[subIndex]?.included
                                    }
                                    onChange={() => {
                                      const updatedPermissions =
                                        permissions.menuPermissions.adminMenu.map(
                                          (menuItem, i) => {
                                            if (i === index) {
                                              const updatedSubmenus =
                                                menuItem.submenus.map(
                                                  (submenuItem, j) => {
                                                    if (j === subIndex) {
                                                      return {
                                                        ...submenuItem,
                                                        included:
                                                          !submenuItem.included,
                                                      };
                                                    }
                                                    return submenuItem;
                                                  }
                                                );
                                              const parentIncluded =
                                                updatedSubmenus.some(
                                                  (sub) => sub.included
                                                );
                                              return {
                                                ...menuItem,
                                                included: parentIncluded,
                                                submenus: updatedSubmenus,
                                              };
                                            }
                                            return menuItem;
                                          }
                                        );
                                      setPermissions((prev) => ({
                                        ...prev,
                                        menuPermissions: {
                                          ...prev.menuPermissions,
                                          adminMenu: updatedPermissions,
                                        },
                                      }));
                                    }}
                                  />
                                  {submenu.name}
                                </div>
                                <div className="flex gap-4 ml-10">
                                  {["create", "view", "edit", "delete"].map(
                                    (permission) => (
                                      <label
                                        key={permission}
                                        className="flex items-center gap-1"
                                      >
                                        <input
                                          type="checkbox"
                                          disabled={
                                            !permissions.menuPermissions
                                              .adminMenu[index]?.submenus[
                                              subIndex
                                            ]?.included
                                          }
                                          checked={permissions.menuPermissions.adminMenu[
                                            index
                                          ]?.submenus[
                                            subIndex
                                          ]?.permission.includes(permission)}
                                          onChange={() => {
                                            const updatedPermissions =
                                              permissions.menuPermissions.adminMenu.map(
                                                (menuItem, i) => {
                                                  if (i === index) {
                                                    const updatedSubmenus =
                                                      menuItem.submenus.map(
                                                        (submenuItem, j) => {
                                                          if (j === subIndex) {
                                                            const newPermissions =
                                                              submenuItem.permission.includes(
                                                                permission
                                                              )
                                                                ? submenuItem.permission.filter(
                                                                    (perm) =>
                                                                      perm !==
                                                                      permission
                                                                  )
                                                                : [
                                                                    ...submenuItem.permission,
                                                                    permission,
                                                                  ];
                                                            return {
                                                              ...submenuItem,
                                                              permission:
                                                                newPermissions,
                                                            };
                                                          }
                                                          return submenuItem;
                                                        }
                                                      );
                                                    return {
                                                      ...menuItem,
                                                      submenus: updatedSubmenus,
                                                    };
                                                  }
                                                  return menuItem;
                                                }
                                              );
                                            setPermissions((prev) => ({
                                              ...prev,
                                              menuPermissions: {
                                                ...prev.menuPermissions,
                                                adminMenu: updatedPermissions,
                                              },
                                            }));
                                          }}
                                        />
                                        {permission.charAt(0).toUpperCase() +
                                          permission.slice(1)}
                                      </label>
                                    )
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedItem === "page" && (
                    <>
                      {/* <pre>{JSON.stringify(selectedContent, null, 2)}</pre> */}
                      <div className="p-2">
                        <div>
                          {selectedContent.tabs.map((tab, tabIndex) => (
                            <div key={tabIndex} className="px-2">
                              <h1 className="flex item py-1 items-center justify-between gap-1 font-semibold cursor-pointer hover:bg-blue-50 dark:hover:bg-neutral-800">
                                <span className="flex items-center gap-3">
                                  <FaArrowRight />
                                  <span className="bg-blue-700 px-2 rounded-r-full text-xs font-normal text-white">
                                    Tab {tabIndex + 1}
                                  </span>
                                  {tab.tabName}
                                </span>
                                <span className="flex items-center justify-center gap-2">
                                  <label className="flex items-center gap-1 border rounded px-1">
                                    <input
                                      type="checkbox"
                                      checked={
                                        permissions.formPermissions[formIndex]
                                          .tabs[tabIndex].view
                                      }
                                      onChange={(e) =>
                                        handleCheckboxChange(
                                          `formPermissions.${formIndex}.tabs.${tabIndex}.view`,
                                          e.target.checked
                                        )
                                      }
                                    />
                                    View
                                  </label>
                                </span>
                              </h1>
                              <div>
                                {tab.sections.map((section, sectionIndex) => (
                                  <div
                                    key={sectionIndex}
                                    className="ml-5 border-t dark:border-neutral-600"
                                  >
                                    <h1 className="flex items-center justify-between gap-1 py-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-neutral-800">
                                      <span className="flex items-center gap-3">
                                        <MdOutlineSubdirectoryArrowRight />
                                        <span className="bg-blue-500 px-2 rounded-r-full text-xs font-normal text-white">
                                          Section {sectionIndex + 1}
                                        </span>
                                        {section.sectionName}
                                      </span>
                                      <span className="flex items-center justify-center gap-2">
                                        <label className="flex items-center gap-1 border rounded px-1">
                                          <input
                                            type="checkbox"
                                            disabled={
                                              !permissions.formPermissions[
                                                formIndex
                                              ].tabs[tabIndex].view
                                            }
                                            checked={
                                              permissions.formPermissions[
                                                formIndex
                                              ].tabs[tabIndex].sections[
                                                sectionIndex
                                              ].view
                                            }
                                            onChange={(e) =>
                                              handleCheckboxChange(
                                                `formPermissions.${formIndex}.tabs.${tabIndex}.sections.${sectionIndex}.view`,
                                                e.target.checked
                                              )
                                            }
                                          />
                                          View
                                        </label>
                                      </span>
                                    </h1>
                                    <div>
                                      {section.fields.map(
                                        (field, fieldIndex) => (
                                          <div
                                            key={fieldIndex}
                                            className="ml-5 border-t dark:border-neutral-600"
                                          >
                                            <h1 className="flex items-center justify-between gap-1 py-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-neutral-800">
                                              <span className="flex items-center gap-3">
                                                <MdOutlineSubdirectoryArrowRight />
                                                <span className="bg-blue-200 px-2 rounded-r-full text-xs font-normal text-blue-600">
                                                  Field {fieldIndex + 1}
                                                </span>
                                                {field.fieldName}
                                              </span>

                                              <span className="flex items-center justify-center gap-2">
                                                <label className="flex items-center gap-1 border rounded px-1">
                                                  <input
                                                    type="radio"
                                                    disabled={
                                                      !permissions
                                                        .formPermissions[
                                                        formIndex
                                                      ].tabs[tabIndex].sections[
                                                        sectionIndex
                                                      ].view
                                                    }
                                                    checked={
                                                      permissions
                                                        .formPermissions[
                                                        formIndex
                                                      ].tabs[tabIndex].sections[
                                                        sectionIndex
                                                      ].fields[fieldIndex]
                                                        .permission ===
                                                      "readonly"
                                                    }
                                                    onChange={() =>
                                                      handleRadioChange(
                                                        `formPermissions.${formIndex}.tabs.${tabIndex}.sections.${sectionIndex}.fields.${fieldIndex}.permission`,
                                                        "readonly"
                                                      )
                                                    }
                                                  />
                                                  Readonly
                                                </label>
                                                <label className="flex items-center gap-1 border rounded px-1">
                                                  <input
                                                    type="radio"
                                                    disabled={
                                                      !permissions
                                                        .formPermissions[
                                                        formIndex
                                                      ].tabs[tabIndex].sections[
                                                        sectionIndex
                                                      ].view
                                                    }
                                                    checked={
                                                      permissions
                                                        .formPermissions[
                                                        formIndex
                                                      ].tabs[tabIndex].sections[
                                                        sectionIndex
                                                      ].fields[fieldIndex]
                                                        .permission === "edit"
                                                    }
                                                    onChange={() =>
                                                      handleRadioChange(
                                                        `formPermissions.${formIndex}.tabs.${tabIndex}.sections.${sectionIndex}.fields.${fieldIndex}.permission`,
                                                        "edit"
                                                      )
                                                    }
                                                  />
                                                  Edit
                                                </label>
                                                <label className="flex items-center gap-1 border rounded px-1">
                                                  <input
                                                    type="radio"
                                                    disabled={
                                                      !permissions
                                                        .formPermissions[
                                                        formIndex
                                                      ].tabs[tabIndex].sections[
                                                        sectionIndex
                                                      ].view
                                                    }
                                                    checked={
                                                      permissions
                                                        .formPermissions[
                                                        formIndex
                                                      ].tabs[tabIndex].sections[
                                                        sectionIndex
                                                      ].fields[fieldIndex]
                                                        .permission === "hidden"
                                                    }
                                                    onChange={() =>
                                                      handleRadioChange(
                                                        `formPermissions.${formIndex}.tabs.${tabIndex}.sections.${sectionIndex}.fields.${fieldIndex}.permission`,
                                                        "hidden"
                                                      )
                                                    }
                                                  />
                                                  Hidden
                                                </label>
                                              </span>
                                            </h1>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {selectedItem === "tab" && (
                    <>
                      {/* <pre>{JSON.stringify(selectedContent, null, 2)}</pre> */}
                      <div>
                        <table className="w-full border dark:border-neutral-600">
                          <thead>
                            <tr className="text-left bg-neutral-100 dark:bg-neutral-950/90">
                              <th className="p-2">Section Name</th>
                              <th className="p-2 border-l dark:border-neutral-600">
                                View
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedContent.sections.map((section, index) => (
                              <tr key={index}>
                                <td className="border-b dark:border-neutral-600 p-2">
                                  {section.sectionName}
                                </td>
                                <td className="border-l border-b dark:border-neutral-600 p-2">
                                  <input
                                    type="checkbox"
                                    name=""
                                    id=""
                                    className="h-4 w-4"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {selectedItem === "section" && (
                    <>
                      {/* <pre>{JSON.stringify(selectedContent, null, 2)}</pre> */}
                      <div>
                        <table className="w-full border dark:border-neutral-600">
                          <thead>
                            <tr className="text-left bg-neutral-100 dark:bg-neutral-950/90">
                              <th className="p-2">Field Name</th>
                              <th className="p-2 border-l dark:border-neutral-600">
                                Readonly
                              </th>
                              <th className="p-2 border-l dark:border-neutral-600">
                                Edit
                              </th>
                              <th className="p-2 border-l dark:border-neutral-600">
                                Hidden
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedContent.fields.map((field, index) => (
                              <tr key={index}>
                                <td className="border-b dark:border-neutral-600 p-2">
                                  {field.fieldName}
                                </td>
                                <td className="border-l border-b dark:border-neutral-600 p-2">
                                  <input
                                    type="radio"
                                    name=""
                                    id=""
                                    className="h-4 w-4"
                                  />
                                </td>
                                <td className="border-l border-b dark:border-neutral-600 p-2">
                                  <input
                                    type="radio"
                                    name=""
                                    id=""
                                    className="h-4 w-4"
                                  />
                                </td>
                                <td className="border-l border-b dark:border-neutral-600 p-2">
                                  <input
                                    type="radio"
                                    name=""
                                    id=""
                                    className="h-4 w-4"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {selectedItem === "report" && (
                    <>
                      {/* <pre>{JSON.stringify(selectedContent, null, 2)}</pre> */}
                      <div className="px-2 space-y-3">
                        {reportData.map((report) => (
                          <div
                            key={report.reportId}
                            className="relative z-0 p-3 flex flex-col gap-2 border dark:border-neutral-600 rounded-lg shadow-md"
                          >
                            <div className="flex gap-2 items-center justify-between">
                              <div className="flex items-center gap-2">
                                <FaArrowRight className="text-blue-600" />
                                <input
                                  type="checkbox"
                                  className="h-4 w-4"
                                  checked={
                                    permissions.reportPermissions.find(
                                      (p) => p.id === report.reportId
                                    )?.included
                                  }
                                  onChange={() => {
                                    setPermissions((prev) => ({
                                      ...prev,
                                      reportPermissions:
                                        prev.reportPermissions.map((p) =>
                                          p.id === report.reportId
                                            ? {
                                                ...p,
                                                included: !p.included,
                                                subReports: p.subReports.map(
                                                  (sub) => ({
                                                    ...sub,
                                                    included: !p.included,
                                                    view: !p.included
                                                      ? sub.view
                                                      : false,
                                                    expport: !p.included
                                                      ? sub.expport
                                                      : false,
                                                    generate: !p.included
                                                      ? sub.generate
                                                      : false,
                                                  })
                                                ),
                                              }
                                            : p
                                        ),
                                    }));
                                  }}
                                />
                                <HiOutlineDocumentReport className="text-2xl text-blue-600" />
                                <h1 className="text-lg font-semibold">
                                  {report.reportName}
                                </h1>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Toggle Button for Accordion */}
                                <button
                                  onClick={() => toggleReport(report.reportId)}
                                  className="text-2xl text-blue-500"
                                >
                                  {openReportId === report.reportId ? (
                                    <MdExpandMore className="rotate-180 transition-all cursor-pointer" />
                                  ) : (
                                    <MdExpandMore className="transition-all cursor-pointer" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {openReportId === report.reportId && (
                              <div className="mt-2 w-full">
                                {report.subReports.map((subReport) => (
                                  <div
                                    key={subReport.reportId}
                                    className="p-2 ml-5 flex items-center justify-between gap-2 border-t dark:border-neutral-600"
                                  >
                                    <div className="flex items-center gap-2">
                                      <MdOutlineSubdirectoryArrowRight className="text-blue-600" />
                                      <input
                                        type="checkbox"
                                        className=""
                                        checked={
                                          permissions.reportPermissions
                                            .find(
                                              (p) => p.id === report.reportId
                                            )
                                            ?.subReports.find(
                                              (sub) =>
                                                sub.id === subReport.reportId
                                            )?.included
                                        }
                                        onChange={() => {
                                          setPermissions((prev) => {
                                            const updatedReportPermissions =
                                              prev.reportPermissions.map(
                                                (p) => {
                                                  if (
                                                    p.id === report.reportId
                                                  ) {
                                                    const updatedSubReports =
                                                      p.subReports.map(
                                                        (sub) => {
                                                          if (
                                                            sub.id ===
                                                            subReport.reportId
                                                          ) {
                                                            return {
                                                              ...sub,
                                                              included:
                                                                !sub.included,
                                                            };
                                                          }
                                                          return sub;
                                                        }
                                                      );

                                                    // Check if any sub-report is now checked
                                                    const anySubReportChecked =
                                                      updatedSubReports.some(
                                                        (sub) => sub.included
                                                      );

                                                    return {
                                                      ...p,
                                                      included:
                                                        anySubReportChecked,
                                                      subReports:
                                                        updatedSubReports,
                                                    };
                                                  }
                                                  return p;
                                                }
                                              );

                                            return {
                                              ...prev,
                                              reportPermissions:
                                                updatedReportPermissions,
                                            };
                                          });
                                        }}
                                      />
                                      <HiOutlineDocumentReport className="text-xl text-blue-500" />
                                      <span className="text-sm">
                                        {subReport.reportName}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      {/* View Checkbox */}
                                      <label className="flex items-center gap-1 text-sm border rounded px-1 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className=""
                                          checked={
                                            permissions.reportPermissions
                                              .find(
                                                (p) => p.id === report.reportId
                                              )
                                              ?.subReports.find(
                                                (sub) =>
                                                  sub.id === subReport.reportId
                                              )?.view
                                          }
                                          onChange={() => {
                                            setPermissions((prev) => ({
                                              ...prev,
                                              reportPermissions:
                                                prev.reportPermissions.map(
                                                  (p) => {
                                                    if (
                                                      p.id === report.reportId
                                                    ) {
                                                      const updatedSubReports =
                                                        p.subReports.map(
                                                          (sub) => {
                                                            if (
                                                              sub.id ===
                                                              subReport.reportId
                                                            ) {
                                                              const newViewState =
                                                                !sub.view;
                                                              return {
                                                                ...sub,
                                                                view: newViewState,
                                                                included:
                                                                  newViewState ||
                                                                  sub.expport ||
                                                                  sub.generate,
                                                              };
                                                            }
                                                            return sub;
                                                          }
                                                        );

                                                      return {
                                                        ...p,
                                                        included:
                                                          updatedSubReports.some(
                                                            (sub) =>
                                                              sub.view ||
                                                              sub.expport ||
                                                              sub.generate
                                                          ),
                                                        subReports:
                                                          updatedSubReports,
                                                      };
                                                    }
                                                    return p;
                                                  }
                                                ),
                                            }));
                                          }}
                                        />
                                        View
                                      </label>

                                      {/* Export Checkbox */}
                                      <label className="flex items-center gap-1 text-sm border rounded px-1 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className=""
                                          checked={
                                            permissions.reportPermissions
                                              .find(
                                                (p) => p.id === report.reportId
                                              )
                                              ?.subReports.find(
                                                (sub) =>
                                                  sub.id === subReport.reportId
                                              )?.expport
                                          }
                                          onChange={() => {
                                            setPermissions((prev) => ({
                                              ...prev,
                                              reportPermissions:
                                                prev.reportPermissions.map(
                                                  (p) => {
                                                    if (
                                                      p.id === report.reportId
                                                    ) {
                                                      const updatedSubReports =
                                                        p.subReports.map(
                                                          (sub) => {
                                                            if (
                                                              sub.id ===
                                                              subReport.reportId
                                                            ) {
                                                              const newExportState =
                                                                !sub.expport;
                                                              return {
                                                                ...sub,
                                                                expport:
                                                                  newExportState,
                                                                included:
                                                                  newExportState ||
                                                                  sub.view ||
                                                                  sub.generate,
                                                              };
                                                            }
                                                            return sub;
                                                          }
                                                        );

                                                      return {
                                                        ...p,
                                                        included:
                                                          updatedSubReports.some(
                                                            (sub) =>
                                                              sub.view ||
                                                              sub.expport ||
                                                              sub.generate
                                                          ),
                                                        subReports:
                                                          updatedSubReports,
                                                      };
                                                    }
                                                    return p;
                                                  }
                                                ),
                                            }));
                                          }}
                                        />
                                        Export
                                      </label>

                                      {/* Generate Checkbox */}
                                      <label className="flex items-center gap-1 text-sm border rounded px-1 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          className=""
                                          checked={
                                            permissions.reportPermissions
                                              .find(
                                                (p) => p.id === report.reportId
                                              )
                                              ?.subReports.find(
                                                (sub) =>
                                                  sub.id === subReport.reportId
                                              )?.generate
                                          }
                                          onChange={() => {
                                            setPermissions((prev) => ({
                                              ...prev,
                                              reportPermissions:
                                                prev.reportPermissions.map(
                                                  (p) => {
                                                    if (
                                                      p.id === report.reportId
                                                    ) {
                                                      const updatedSubReports =
                                                        p.subReports.map(
                                                          (sub) => {
                                                            if (
                                                              sub.id ===
                                                              subReport.reportId
                                                            ) {
                                                              const newGenerateState =
                                                                !sub.generate;
                                                              return {
                                                                ...sub,
                                                                generate:
                                                                  newGenerateState,
                                                                included:
                                                                  newGenerateState ||
                                                                  sub.view ||
                                                                  sub.expport,
                                                              };
                                                            }
                                                            return sub;
                                                          }
                                                        );

                                                      return {
                                                        ...p,
                                                        included:
                                                          updatedSubReports.some(
                                                            (sub) =>
                                                              sub.view ||
                                                              sub.expport ||
                                                              sub.generate
                                                          ),
                                                        subReports:
                                                          updatedSubReports,
                                                      };
                                                    }
                                                    return p;
                                                  }
                                                ),
                                            }));
                                          }}
                                        />
                                        Generate
                                      </label>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {selectedItem === "workflow" && (
                    <>
                      {/* <pre>{JSON.stringify(selectedContent, null, 2)}</pre> */}
                      <div className="p-2">
                        <table className="min-w-full table-auto border-collapse border dark:border-neutral-600">
                          <thead>
                            <tr className="bg-neutral-100 dark:bg-neutral-950/90 text-left">
                              <th className="px-4 py-2 border-b dark:border-neutral-600 font-semibold">
                                Diagrams
                              </th>
                              <th className="px-4 py-2 border-b dark:border-neutral-600 font-semibold">
                                Create
                              </th>
                              <th className="px-4 py-2 border-b dark:border-neutral-600 font-semibold">
                                View
                              </th>
                              <th className="px-4 py-2 border-b dark:border-neutral-600 font-semibold">
                                Edit
                              </th>
                              <th className="px-4 py-2 border-b dark:border-neutral-600 font-semibold">
                                Delete
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {wrokflowData.map((diagram, index) => (
                              <tr
                                key={index}
                                className="hover:bg-neutral-200 dark:hover:bg-neutral-800"
                              >
                                <td className="px-4 py-2 border-b dark:border-neutral-600">
                                  {diagram.name}
                                </td>
                                <td className="px-4 py-2 border-b dark:border-neutral-600">
                                  <input
                                    type="checkbox"
                                    name={`create-${index}`}
                                    id={`create-${index}`}
                                    checked={
                                      permissions.workflowPermissions[index]
                                        .create
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChangeForWorkflowPermissions(
                                        index,
                                        "create",
                                        e.target.checked
                                      )
                                    }
                                    className="form-checkbox h-4 w-4 text-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="px-4 py-2 border-b dark:border-neutral-600">
                                  <input
                                    type="checkbox"
                                    name={`view-${index}`}
                                    id={`view-${index}`}
                                    checked={
                                      permissions.workflowPermissions[index]
                                        .view
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChangeForWorkflowPermissions(
                                        index,
                                        "view",
                                        e.target.checked
                                      )
                                    }
                                    className="form-checkbox h-4 w-4 text-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="px-4 py-2 border-b dark:border-neutral-600">
                                  <input
                                    type="checkbox"
                                    name={`edit-${index}`}
                                    id={`edit-${index}`}
                                    checked={
                                      permissions.workflowPermissions[index]
                                        .edit
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChangeForWorkflowPermissions(
                                        index,
                                        "edit",
                                        e.target.checked
                                      )
                                    }
                                    className="form-checkbox h-4 w-4 text-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="px-4 py-2 border-b dark:border-neutral-600">
                                  <input
                                    type="checkbox"
                                    name={`delete-${index}`}
                                    id={`delete-${index}`}
                                    checked={
                                      permissions.workflowPermissions[index]
                                        .delete
                                    }
                                    onChange={(e) =>
                                      handleCheckboxChangeForWorkflowPermissions(
                                        index,
                                        "delete",
                                        e.target.checked
                                      )
                                    }
                                    className="form-checkbox h-4 w-4 text-blue-500 cursor-pointer"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </PermissionDialog>
  );
};

export default PermissionSettingsDialog;
