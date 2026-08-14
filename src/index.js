import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './styles/theme.css'
import './i18n'
import { App } from './app/App'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
          <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
