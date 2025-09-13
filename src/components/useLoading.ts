import { useContext } from 'react'
import { LoadingContext, type LoadingContextType } from './LoadingContextBase';

// export type LoadingContextType = {
//   openLoading: () => void
//   closeLoading: () => void
// }

// export const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function useLoading(): LoadingContextType {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error('useLoading debe usarse dentro de un <LoadingProvider>');
  return ctx
}