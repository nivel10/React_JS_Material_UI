import { createContext } from "react"

export type LoadingContextType = {
  openLoading: () => void
  closeLoading: () => void
}

export const LoadingContext = createContext<LoadingContextType | undefined>(undefined)