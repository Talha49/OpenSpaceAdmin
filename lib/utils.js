import { toast, Bounce } from "react-toastify";
import { useTheme } from "next-themes";
import "react-toastify/dist/ReactToastify.css";

export const useNotify = () => {
  const { theme } = useTheme();
  
  const toastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: theme === "dark" ? "dark" : "light", // Dynamic theme
    transition: Bounce,
    // progressStyle: { background: "#2563EB" }, // Blue progress bar
  };

  return {
    info: (message) => toast.info(message, { ...toastOptions }),
    success: (message) => toast.success(message, { ...toastOptions }),
    warning: (message) => toast.warning(message, { ...toastOptions }),
    error: (message) => toast.error(message, { ...toastOptions }),
    default: (message) => toast(message, { ...toastOptions }), // Normal notification
  };
};
