import { useEffect } from "react";

const Notification = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose(), 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const typeStyles = {
    error: "bg-red-500 text-white",
    success: "bg-green-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div role="alert" className={`px-6 py-3 rounded-lg shadow-lg animate-slideDown ${style}`}>
        {message}
      </div>
    </div>
  );
};

export default Notification;