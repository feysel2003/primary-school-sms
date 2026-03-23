import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n/i18n'
import { ThemeProvider } from './hooks/ThemeContext' // <--- Import Provider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider> {/* <--- Wrap App inside ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)