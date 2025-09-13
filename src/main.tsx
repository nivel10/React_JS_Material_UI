import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/AuthProvider.tsx'

import "@fontsource/poppins/300.css"
import "@fontsource/poppins/400.css"
import "@fontsource/poppins/500.css"
import "@fontsource/poppins/700.css"
import NotificationProvider from './components/NotificationContext.tsx'
import LoadingProvider from './components/LoadingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <LoadingProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LoadingProvider>
      </NotificationProvider>
    </BrowserRouter>

  </StrictMode>,
)