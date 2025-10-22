import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast"; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "Titillium Web, sans-serif", 
            fontSize: "15px",
            fontWeight: "500",
            borderRadius: "10px",
            padding: "12px 16px",
            background: "#ffffff",
            color: "#222",
          },
          success: {
            style: {
              background: "#e0f7f4",
              color: "#0f766e",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "#0f766e",
              secondary: "#ffffff",
            },
          },
          error: {
            style: {
              background: "#ffe4e6",
              color: "#b91c1c",
              fontWeight: "600",
            },
            iconTheme: {
              primary: "#b91c1c",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>,
);
