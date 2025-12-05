import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRouter from './routers/AppRouter.jsx';
import { CartProvider } from "./context/CartContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);
