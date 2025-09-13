import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { AlertColor } from "@mui/material";

export type NotificationMessage = string | ReactNode;

export interface NotificationContextType {
  notify: (message: NotificationMessage, severity?: AlertColor, duration?: number) => void;
  success: (message: NotificationMessage, duration?: number) => void;
  error: (message: NotificationMessage, duration?: number) => void;
  info: (message: NotificationMessage, duration?: number) => void;
  warning: (message: NotificationMessage, duration?: number) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification debe usarse dentro de NotificationProvider");
  return ctx;
};