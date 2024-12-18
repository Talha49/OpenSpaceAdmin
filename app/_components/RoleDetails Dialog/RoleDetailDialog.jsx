import React from "react";

const RoleDetailDialog = ({ isOpen, onClose, children, role }) => {
  // Render menu permissions
  const renderMenuPermissions = () => {
    return role?.permissions?.menuPermissions?.map((menu) => (
      <div key={menu.id} className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800">{menu?.name}</h3>
        <ul className="list-disc pl-5 mt-2">
          {menu.permission?.map((perm, index) => (
            <li key={index} className="text-gray-600">
              {perm}
            </li>
          ))}
        </ul>
        {menu.submenus?.length > 0 && (
          <div className="mt-4">
            {menu.submenus?.map((submenu) => (
              <div
                key={submenu.id}
                className="bg-gray-50 p-4 rounded-lg mt-2 shadow-sm"
              >
                <h4 className="text-md font-semibold text-gray-700">
                  {submenu?.name}
                </h4>
                <ul className="list-disc pl-5 mt-2">
                  {submenu.permission?.map((perm, index) => (
                    <li key={index} className="text-gray-600">
                      {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    ));
  };

  // Render form permissions
  const renderFormPermissions = () => {
    return Object.keys(role?.permissions?.formPermissions || {}).map(
      (formKey) => {
        const form = role.permissions.formPermissions[formKey];
        return (
          <div key={formKey} className="bg-white p-4 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {form?.name}
            </h3>
            {Object.keys(form.tabs || {}).map((tabKey) => {
              const tab = form.tabs[tabKey];
              return (
                <div key={tabKey} className="mt-4">
                  <h4 className="text-lg font-medium text-gray-700">
                    {tab?.name}
                  </h4>
                  {Object.keys(tab.sections || {}).map((sectionKey) => {
                    const section = tab.sections[sectionKey];
                    return (
                      <div key={sectionKey} className="mt-4">
                        <h5 className="font-semibold text-gray-600">
                          {section?.name}
                        </h5>
                        {Object.keys(section.fields || {}).map((fieldKey) => {
                          const field = section.fields[fieldKey];
                          return (
                            <div key={fieldKey} className="text-gray-500 mt-1">
                              <p>
                                {field?.name}:{" "}
                                <span className="font-semibold">
                                  {field?.permission}
                                </span>
                              </p>
                            </div>
                          );
                        })}
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
      <div key={report.id} className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{report?.name}</h3>
        {report.subReports?.map((subReport) => (
          <div key={subReport.id} className="mt-4">
            <h4 className="text-lg font-medium text-gray-700">
              {subReport?.name}
            </h4>
            <ul className="list-disc pl-5">
              {subReport.view && <li className="text-gray-600">View</li>}
              {subReport.export && <li className="text-gray-600">Export</li>}
              {subReport.generate && (
                <li className="text-gray-600">Generate</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  // Render workflow permissions
  const renderWorkflowPermissions = () => {
    return role?.permissions?.workflowPermissions?.map((workflow, index) => (
      <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          {workflow?.name}
        </h3>
        <ul className="list-disc pl-5">
          {workflow.create && <li className="text-gray-600">Create</li>}
          {workflow.view && <li className="text-gray-600">View</li>}
          {workflow.edit && <li className="text-gray-600">Edit</li>}
          {workflow.delete && <li className="text-gray-600">Delete</li>}
        </ul>
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
        className={`fixed top-0 right-0 h-screen md:w-1/2 w-full z-50 transition-transform duration-300 bg-white dark:bg-stone-950 border-l dark:border-neutral-700 shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="h-full p-6 overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-semibold text-gray-800">{role?.name}</h2>
          <p className="text-gray-600 text-lg mt-2">{role?.description}</p>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800">Permissions</h3>
            <div className="permissions mt-4">
              <h4 className="font-semibold text-gray-700">Menu Permissions:</h4>
              {renderMenuPermissions()}
              <h4 className="font-semibold text-gray-700">Form Permissions:</h4>
              {renderFormPermissions()}
              <h4 className="font-semibold text-gray-700">
                Report Permissions:
              </h4>
              {renderReportPermissions()}
              <h4 className="font-semibold text-gray-700">
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
