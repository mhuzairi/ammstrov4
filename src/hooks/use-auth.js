import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing authentication on component mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    try {
      const authData = localStorage.getItem('ammstro_auth')
      if (authData) {
        const parsedAuth = JSON.parse(authData)
        if (parsedAuth.isAuthenticated && parsedAuth.user) {
          setIsAuthenticated(true)
          setUser(parsedAuth.user)
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error)
      // Clear invalid auth data
      localStorage.removeItem('ammstro_auth')
    } finally {
      setLoading(false)
    }
  }

  const login = (userData) => {
    const authData = {
      isAuthenticated: true,
      user: userData
    }
    localStorage.setItem('ammstro_auth', JSON.stringify(authData))
    setIsAuthenticated(true)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('ammstro_auth')
    setIsAuthenticated(false)
    setUser(null)
    // Redirect to home page
    window.location.href = '/'
  }

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuthStatus
  }
}