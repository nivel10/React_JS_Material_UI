import React, { type ReactNode, useCallback, useState } from 'react'
import { Backdrop, CircularProgress } from '@mui/material'
import { LoadingContext } from './LoadingContextBase'

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const openLoading = useCallback(() => setIsLoading(true), [])
  const closeLoading = useCallback(() => setIsLoading(false), [])

  return (
    <LoadingContext.Provider value={{ openLoading, closeLoading }}>
      {children}
      <Backdrop aria-busy={true}
        role='alertdialog'
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 999 }}
        open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </LoadingContext.Provider>
  )
}

export default LoadingProvider;