import React, { useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import type { AlertColor } from "@mui/material";
import { NotificationContext, type NotificationMessage } from "./notificationCtx";

interface NotificationItem {
  id: string;
  message: NotificationMessage;
  severity: AlertColor;
  duration?: number;
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<NotificationItem[]>([]);

  const push = (msg: NotificationMessage, sev: AlertColor = "info", duration = 4000) => {
    const id = Math.random().toString(36).slice(2);
    setItems((s) => [...s, { id, message: msg, severity: sev, duration }]);
  };

  const notify = (message: NotificationMessage, severity: AlertColor = "info", duration?: number) =>
    push(message, severity, duration);

  const success = (message: NotificationMessage, duration?: number) => notify(message, "success", duration);
  const error = (message: NotificationMessage, duration?: number) => notify(message, "error", duration);
  const info = (message: NotificationMessage, duration?: number) => notify(message, "info", duration);
  const warning = (message: NotificationMessage, duration?: number) => notify(message, "warning", duration);

  const handleClose = (id: string) => (_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setItems((s) => s.filter((it) => it.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify, success, error, info, warning }}>
      {children}
      {items.map((it) => (
        <Snackbar
          key={it.id}
          open
          autoHideDuration={it.duration ?? 4000}
          onClose={handleClose(it.id)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={handleClose(it.id)} severity={it.severity} variant="filled" sx={{ width: "100%" }}>
            {it.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;