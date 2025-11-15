import { useCallback } from 'react'
import { useAuthStore } from '../store'
import { getAuthService } from '@/shared/di'

/**
 * useAuth Hook
 *
 * Hook personalizado para manejar la autenticación.
 * Conecta el AuthService con el Zustand store.
 */
export function useAuth() {
  const { status, session, error, setLoading, setAuthenticated, setError, setIdle, clearSession } =
    useAuthStore()

  /**
   * Realiza login
   */
  const login = useCallback(
    async (username: string, password: string, remember: boolean = false): Promise<void> => {
      setLoading()

      try {
        const authService = getAuthService()
        const newSession = await authService.login(username, password, remember)
        setAuthenticated(newSession)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        throw err
      }
    },
    [setLoading, setAuthenticated, setError]
  )

  /**
   * Realiza logout
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      const authService = getAuthService()
      await authService.logout()
      clearSession()
    } catch (err) {
      // Incluso si falla, limpiar localmente
      clearSession()
      throw err
    }
  }, [clearSession])

  /**
   * Fuerza logout sin llamar al servidor
   */
  const forceLogout = useCallback(async (): Promise<void> => {
    const authService = getAuthService()
    await authService.forceLogout()
    clearSession()
  }, [clearSession])

  /**
   * Verifica si hay una sesión activa
   */
  const checkSession = useCallback(async (): Promise<void> => {
    const authService = getAuthService()
    const hasSession = await authService.hasActiveSession()

    if (hasSession) {
      const currentSession = await authService.getCurrentSession()
      if (currentSession) {
        setAuthenticated(currentSession)
      } else {
        setIdle()
      }
    } else {
      setIdle()
    }
  }, [setAuthenticated, setIdle])

  return {
    // State
    status,
    session,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
    isError: status === 'error',

    // Actions
    login,
    logout,
    forceLogout,
    checkSession,
  }
}
