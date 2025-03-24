import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Import,
} from "lucide-react";
import { useNotify } from "@/lib/utils";
import { FaCloudShowersHeavy } from "react-icons/fa";
import Loader from "@/app/_components/Loader/Loader";

const ImportUsersDialog = ({ isOpen, onClose, onSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [tableData, setTableData] = useState([]); // Store parsed table data
  const [dbReadyData, setDbReadyData] = useState([]); // Data formatted for DB
  const [isImporting, setIsImporting] = useState(false);

  const inputRef = useRef(null);
  const notify = useNotify();

  // Handle Drag & Drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    e.preventDefault();
    handleFiles(e.target.files);
  };

  const handleFiles = (files) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

    if (["xlsx", "xls", "csv"].includes(fileExtension)) {
      setFile(selectedFile);
      parseExcel(selectedFile);
    } else {
      setErrorMessage("Please select a valid Excel (.xlsx, .xls) or CSV file.");
      setUploadStatus("error");
    }
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        header: 1,
      });

      if (sheet.length > 1) {
        const rows = sheet.slice(1); // Remaining rows as data

        // Convert to table format
        setTableData(rows);

        // Convert to database format
        const formattedData = rows.map((row) => ({
          name: row[0] || "", // Assuming Name is the first column
          email: row[1] || "", // Email is the second column
          address: row[2] || "", // Address is the third column
          city: row[3] || "", // City is the fourth column
          contact: row[4] || "", // Contact is the fifth column
        }));

        setDbReadyData(formattedData);
        setUploadStatus("success");
      } else {
        setErrorMessage("The file is empty or has incorrect formatting.");
        setUploadStatus("error");
      }
    };
    reader.onerror = () => {
      setErrorMessage("Error reading the file.");
      setUploadStatus("error");
    };
  };

  const handleReset = () => {
    setFile(null);
    setUploadStatus(null);
    setErrorMessage("");
    setTableData([]);
    setDbReadyData([]);
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      setIsImporting(true);
      const res = await fetch("/api/Users/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure correct Content-Type
        },
        body: JSON.stringify(dbReadyData),
      });

      const data = await res.json();

      if (res.ok) {
        notify.success("Users imported successfully!");
        handleReset();
        onClose();
        onSuccess();
      } else {
        throw new Error(data.message || "Failed to import users.");
      }
    } catch (error) {
      console.error("Import error:", error);
      notify.error(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-neutral-900 border dark:border-neutral-500 rounded-lg shadow-lg max-w-3xl w-full min-h-40 max-h-[500px] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">Import Users</h2>
          <div className="flex items-center gap-6">
            {file && (
              <button
                className="flex items-center justify-center gap-2 px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white transition-all"
                onClick={handleImport}
              >
                <Import size={18} />
                <span>Import</span>
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                handleReset();
              }}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <>
            <form className="flex flex-col gap-4" onDragEnter={handleDrag}>
              <div
                className={`border-2 border-dashed rounded-lg p-8 dark:bg-neutral-800 text-center ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-neutral-500"
                }`}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="text-center flex flex-col items-center">
                    <FileSpreadsheet size={36} className="text-blue-600 mb-2" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-gray-500 text-sm">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <button
                      onClick={handleReset}
                      className="text-blue-600 underline mt-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload size={36} className="text-gray-400 mx-auto mb-3" />
                    <p className="font-medium">
                      Drag & drop your Excel file here
                    </p>
                    <p className="text-gray-500 text-sm">
                      Supports .xlsx, .xls, .csv
                    </p>
                    <button
                      type="button"
                      onClick={() => inputRef.current.click()}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mt-3"
                    >
                      Browse Files
                    </button>
                  </>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={handleChange}
                />
              </div>

              {uploadStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  <AlertCircle size={20} className="inline-block mr-2" />
                  {errorMessage}
                </div>
              )}
            </form>

            {tableData.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">
                  Preview File (First 5 Rows):
                </h3>
                <div className="overflow-x-auto max-w-max dark:border-neutral-500 border rounded-lg">
                  <table className="text-sm">
                    <thead className="bg-neutral-100 dark:bg-neutral-700">
                      <tr>
                        <th className="px-4 py-2 text-left min-w-52">Name</th>
                        <th className="px-4 py-2 text-left min-w-60">Email</th>
                        <th className="px-4 py-2 text-left min-w-96">
                          Address
                        </th>
                        <th className="px-4 py-2 text-left min-w-52">City</th>
                        <th className="px-4 py-2 text-left min-w-52">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.slice(0, 5).map((row, index) => (
                        <tr
                          key={index}
                          className="dark:border-neutral-500 border-b"
                        >
                          <td className="px-4 py-2">{row[0]}</td>
                          <td className="px-4 py-2">{row[1]}</td>
                          <td className="px-4 py-2">{row[2]}</td>
                          <td className="px-4 py-2">{row[3]}</td>
                          <td className="px-4 py-2">{row[4]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
      {isImporting && <Loader />}
    </div>
  );
};

export default ImportUsersDialog;
