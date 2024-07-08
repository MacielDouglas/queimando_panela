import { toast } from "react-toastify";

const toastConfig = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: true,
  theme: "colored",
  progress: undefined,
};

/**
 * Custom hook for displaying toast notifications.
 *
 * @returns {Object} An object containing functions to show different types of toast notifications.
 */
const useToast = () => {
  const showSuccess = (message) => {
    toast.success(message, toastConfig);
  };

  const showError = (message) => {
    toast.error(message, toastConfig);
  };

  const showInfo = (message) => {
    toast.info(message, toastConfig);
  };

  const showWarning = (message) => {
    toast.warn(message, toastConfig);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
};

export default useToast;
