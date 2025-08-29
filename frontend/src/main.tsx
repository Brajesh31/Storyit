import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './store/AuthProvider.tsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster
      toastOptions={{
        style: {
          background: '#141615',
          color: '#fff'
        },
        icon:null
      }}
    />
    <AuthProvider>
      <App />
    </AuthProvider>
  </>
)
