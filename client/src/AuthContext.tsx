import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest } from './api'

interface AuthContextValue {
  token: string | null
  username: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_STORAGE_KEY = 'authToken'
const USERNAME_STORAGE_KEY = 'authUsername'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem(USERNAME_STORAGE_KEY))

  async function login(usernameInput: string, password: string) {
    const { token: newToken } = await loginRequest(usernameInput, password)
    localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    localStorage.setItem(USERNAME_STORAGE_KEY, usernameInput)
    setToken(newToken)
    setUsername(usernameInput)
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USERNAME_STORAGE_KEY)
    setToken(null)
    setUsername(null)
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      username,
      isAuthenticated: token !== null,
      login,
      logout,
    }),
    [token, username],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
