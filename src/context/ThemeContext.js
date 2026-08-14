import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'word-toolkit-settings'
const ThemeContext = createContext(null)

function readInitialIsDark() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (typeof parsed?.general?.darkMode === 'boolean') {
        return parsed.general.darkMode
      }
    }
  } catch (err) {
    console.error('Tema sozlamasini o\'qishda xatolik:', err)
  }
  return false
}

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(readInitialIsDark)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const parsed = raw ? JSON.parse(raw) : {}
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            ...parsed,
            general: { ...parsed.general, darkMode: next },
          }),
        )
      } catch (err) {
        console.error('Tema sozlamasini saqlashda xatolik:', err)
      }
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
