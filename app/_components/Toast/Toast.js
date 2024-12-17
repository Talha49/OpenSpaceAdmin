// Toast.js
import { useToast } from "@/lib/toastContext";
import React from "react";

const Toast = () => {
  const { toast } = useToast();

  if (!toast) return null; // If no toast message, render nothing

  const toastClasses = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  return (
    <div
      className={`fixed bottom-4 right-4 px-6 py-3 text-white rounded-lg shadow-lg transition-all transform z-50 ${
        toastClasses[toast.type]
      } animate-toast`}
    >
      {toast.message}
    </div>
  );
};

export default Toast;
