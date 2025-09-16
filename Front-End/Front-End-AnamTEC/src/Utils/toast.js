import { toast } from "react-toastify";

export function showToast(type, message) {
  const config = {
    position: "top-center",
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "custom-toast",   // nossa classe personalizada
    bodyClassName: "custom-toast-body",
    theme: "dark"
  };

  switch (type) {
    case "success":
      toast.success(message, config);
      break;
    case "error":
      toast.error(message, config);
      break;
    case "warn":
      toast.warn(message, config);
      break;
    default:
      toast.info(message, config);
  }
}
