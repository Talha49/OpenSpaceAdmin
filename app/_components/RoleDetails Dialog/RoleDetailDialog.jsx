import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";

const RoleDetailDialog = ({ isOpen, onClose, children, role }) => {
  // Render menu permissions
  const renderMenuPermissions = () => {
    return role?.permissions?.menuPermissions
      ?.filter((menu) => menu.included === true)
      .map((menu) => (
        <div
          key={menu.id}
          className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg mb-4 text-neutral-950 dark:text-neutral-400 border dark:border-neutral-700 shadow-md"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold flex items-center gap-1">
              <FaArrowRight className="text-sm text-blue-600" />
              {menu?.name}
            </h3>
            <div className="flex items-center gap-1 flex-wrap">
              {menu?.permission?.map((perm) => (
                <p className="bg-blue-600 text-white rounded text-xs px-2">
                  {perm}
                </p>
              ))}
              {menu.permission.length === 0 && (
                <p className="bg-blue-600 text-white rounded text-xs px-2">
                  view
                </p>
              )}
            </div>
          </div>
          <ul className="list-disc pl-5">
            {menu.permission
              ?.filter((perm) => perm.included == true)
              .map((perm, index) => (
                <li key={index} className="text-neutral-600">
                  {perm}
                </li>
              ))}
          </ul>
          {menu.submenus?.length > 0 && (
            <div className="mt-2">
              {menu.submenus
                ?.filter((submenu) => submenu.included === true)
                .map((submenu) => (
                  <div
                    key={submenu.id}
                    className="bg-neutral-50 dark:bg-neutral-800 p-2 border dark:border-neutral-700 rounded-lg mt-2 ml-5 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <h4 className="text-md  flex items-center gap-1">
                        <MdOutlineSubdirectoryArrowRight className="text-lg text-blue-600" />
                        {submenu?.name}
                      </h4>
                      <div className="flex items-center gap-1 flex-wrap">
                        {submenu?.permission?.map((perm) => (
                          <p className="bg-blue-600 text-white rounded text-xs px-2">
                            {perm}
                          </p>
                        ))}
                        {submenu.permission.length === 0 && (
                          <p className="bg-blue-600 text-white rounded text-xs px-2">
                            view
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      ));
  };

  // Render form permissions
  const renderFormPermissions = () => {
    console.log("formPermisions =>", role?.permissions?.formPermissions);
    return Object.keys(role?.permissions?.formPermissions || {}).map(
      (formKey) => {
        const form = role.permissions.formPermissions[formKey];
        return (
          <div
            key={formKey}
            className="bg-neutral-100 dark:bg-neutral-900 text-neutral-950 dark:text-neutral-400 p-4 rounded-lg border dark:border-neutral-700 shadow-md mb-6"
          >
            <h3 className="text-xl font-semibold flex items-center gap-1">
              <FaArrowRight className="text-blue-600 text-sm" />
              {form?.name}
            </h3>
            {Object.keys(form.tabs || {}).map((tabKey) => {
              const tab = form.tabs[tabKey];
              return (
                <div
                  key={tabKey}
                  className="mt-4 bg-white dark:bg-neutral-950 border dark:border-neutral-700 p-2 ml-5 rounded-lg shadow-md"
                >
                  <h4 className="text-lg font-medium flex items-center gap-1">
                    <MdOutlineSubdirectoryArrowRight className="text-blue-600 text-lg" />
                    {tab?.name}
                  </h4>
                  {Object.keys(tab.sections || {}).map((sectionKey) => {
                    const section = tab.sections[sectionKey];
                    return (
                      <div
                        key={sectionKey}
                        className="mt-2 ml-6 bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-700 p-2 rounded-lg"
                      >
                        <h5 className="font-semibold flex items-center gap-1">
                          <MdOutlineSubdirectoryArrowRight className="text-blue-600 text-lg" />
                          {section?.name}
                        </h5>
                        <div className="bg-white dark:bg-neutral-950 border dark:border-neutral-700 p-2 rounded-lg mt-2 ml-6">
                          {Object.keys(section.fields || {}).map((fieldKey) => {
                            const field = section.fields[fieldKey];
                            return (
                              <div
                                key={fieldKey}
                                className="text-neutral-500 mt-1"
                              >
                                <div className="flex items-center gap-2">
                                  <p className="flex items-center gap-1">
                                    <MdOutlineSubdirectoryArrowRight className="text-blue-600 text-lg" />
                                    {field.name}
                                  </p>
                                  <span className="bg-blue-600 text-white rounded text-xs px-2">
                                    {field?.permission}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        );
      }
    );
  };

  // Render report permissions
  const renderReportPermissions = () => {
    return role?.permissions?.reportPermissions?.map((report) => (
      <div
        key={report.id}
        className="bg-white dark:bg-neutral-900 border dark:border-neutral-700 text-neutral-950 dark:text-neutral-400 p-4 rounded-lg shadow-lg mb-4"
      >
        <div className="flex items-center gap-1">
          <FaArrowRight className="text-sm text-blue-600" />
          <h3 className="text-xl font-semibold ">{report?.name}</h3>
        </div>
        {report.subReports?.map((subReport) => (
          <div
            key={subReport.id}
            className="flex items-center gap-2 mt-2 ml-5 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg border dark:border-neutral-700"
          >
            <h4 className="text-lg font-medium flex items-center gap-1">
              <MdOutlineSubdirectoryArrowRight className="text-lg text-blue-600" />
              {subReport?.name}
            </h4>
            <div className="flex items-center gap-1 flex-wrap text-xs">
              {subReport.view && (
                <span className="text-white bg-blue-600 rounded px-2">
                  View
                </span>
              )}
              {subReport.export && (
                <span className="text-white bg-blue-600 rounded px-2">
                  Export
                </span>
              )}
              {subReport.generate && (
                <span className="text-white bg-blue-600 rounded px-2">
                  Generate
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    ));
  };

  // Render workflow permissions
  const renderWorkflowPermissions = () => {
    return role?.permissions?.workflowPermissions?.map((workflow, index) => (
      <div
        key={index}
        className="flex items-center gap-2 bg-white dark:bg-neutral-900 border dark:border-neutral-700 text-neutral-950 dark:text-neutral-400 p-4 rounded-lg shadow-lg mb-4"
      >
        <h3 className="text-xl font-semibold flex items-center gap-1">
          <FaArrowRight className="text-blue-600 text-sm" />
          {workflow?.name}
        </h3>
        <div className="flex items-center gap-1 flex-wrap text-xs">
          {workflow.create && (
            <span className="text-white bg-blue-600 rounded px-2">Create</span>
          )}
          {workflow.view && (
            <span className="text-white bg-blue-600 rounded px-2">View</span>
          )}
          {workflow.edit && (
            <span className="text-white bg-blue-600 rounded px-2">Edit</span>
          )}
          {workflow.delete && (
            <span className="text-white bg-blue-600 rounded px-2">Delete</span>
          )}
        </div>
      </div>
    ));
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed top-0 left-0 h-screen w-full bg-black bg-opacity-60 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`fixed top-0 right-0 h-screen md:w-1/2 w-full rounded-l z-50 transition-transform duration-300 bg-white dark:bg-neutral-950 border-l dark:border-neutral-700 shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-8 z-10 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="h-full overflow-y-auto custom-scrollbar">
          <div className="p-6 sticky top-0 bg-neutral-100 dark:bg-neutral-900 border-b dark:border-neutral-700">
            <h2 className="text-2xl font-semibold dark:text-neutral-300">
              {role?.name}
            </h2>
            <p className="dark:text-neutral-500 text-lg mt-2">
              {role?.description}
            </p>
          </div>
          <div className="px-6 py-4">
            <h3 className="text-xl font-semibold dark:text-neutral-300">
              Permissions
            </h3>
            <div className="permissions mt-4">
              <h4 className="font-semibold dark:text-neutral-500">
                Menu Permissions:
              </h4>
              {renderMenuPermissions()}
              <h4 className="font-semibold dark:text-neutral-500">
                Form Permissions:
              </h4>
              {renderFormPermissions()}
              <h4 className="font-semibold dark:text-neutral-500">
                Report Permissions:
              </h4>
              {renderReportPermissions()}
              <h4 className="font-semibold dark:text-neutral-500">
                Workflow Permissions:
              </h4>
              {renderWorkflowPermissions()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoleDetailDialog;
