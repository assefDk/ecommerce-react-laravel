import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './assets/css/style.scss'
import { AdminAuthProvider } from './components/context/AdminAuth.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminAuthProvider>
      <App />
    </AdminAuthProvider>
  </StrictMode>,
)
