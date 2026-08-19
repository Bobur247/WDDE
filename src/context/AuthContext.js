import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import {
  getCurrentUser as apiGetCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  verifyEmail as apiVerifyEmail,
} from '../api/auth'
import { getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    apiGetCurrentUser()
      .then((data) => setUser(data?.user || data?.data || data))
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleExpired = () => {
      setUser(null)
      setAuthError('Sessiya tugagan. Qayta kiring.')
    }
    window.addEventListener('auth:expired', handleExpired)
    return () => window.removeEventListener('auth:expired', handleExpired)
  }, [])

  const login = useCallback(async (email, password, remember) => {
    setAuthError(null)
    try {
      const data = await apiLogin(email, password, remember)
      setUser(data?.user || data?.data?.user || data?.data || data)
      return data
    } catch (error) {
      setAuthError(error)
      throw error
    }
  }, [])

  const register = useCallback(
    (name, email, password, passwordConfirmation) =>
      apiRegister(name, email, password, passwordConfirmation),
    [],
  )

  const verifyEmail = useCallback(
    (email, code) => apiVerifyEmail(email, code),
    [],
  )

  const getCurrentUser = useCallback(async () => {
    const data = await apiGetCurrentUser()
    const currentUser = data?.user || data?.data || data
    setUser(currentUser)
    return currentUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiLogout()
    } finally {
      setUser(null)
      setAuthError(null)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        authError,
        register,
        verifyEmail,
        login,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
