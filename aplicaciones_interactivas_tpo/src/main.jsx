import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './router/AppRouter'
import { AuthProvider } from './auth/context/AuthProvider'
import { CartProvider } from './Cart/context/CartContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
)
