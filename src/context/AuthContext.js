import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { login as apiLogin, logout as apiLogout, getMe } from '../api/auth'
import { getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    getMe()
      .then((data) => setUser(data?.user || data?.data || data))
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password, remember) => {
    const data = await apiLogin(email, password, remember)
    setUser(data?.user || data?.data?.user || data?.data || data)
    return data
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
