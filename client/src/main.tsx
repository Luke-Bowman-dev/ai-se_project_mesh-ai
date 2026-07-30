import { AuthProvider } from './contexts/AuthContext.tsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App/App.tsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthProvider>
)
