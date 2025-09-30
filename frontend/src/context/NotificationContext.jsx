import React, { createContext, useContext, useState } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({ message: "", type: "info" });

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  const hideNotification = () => {
    setNotification({ message: "", type: "info" });
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <Notification message={notification.message} type={notification.type} onClose={hideNotification} />
    </NotificationContext.Provider>
  );
};