import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthContextFunc from "./components/AuthContext.tsx"

// Bootstrap imports added here
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

//AuthContext wrapped around App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextFunc>
      <App />
    </AuthContextFunc>
  </StrictMode>,
)
