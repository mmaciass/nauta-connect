import { useState, useEffect, useCallback } from 'react'
import { getStorageService } from '@/shared/di'

/**
 * useSavedUsers Hook
 *
 * Hook para manejar usuarios guardados (para autocomplete)
 */
export function useSavedUsers() {
  const [savedUsernames, setSavedUsernames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Carga los usuarios guardados
   */
  const loadSavedUsers = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true)
      const storage = getStorageService()
      const users = await storage.loadUsers()

      // Solo extraer usernames para el autocomplete
      const usernames = users.map((user) => user.username)
      setSavedUsernames(usernames)
    } catch (error) {
      console.error('Error loading saved users:', error)
      setSavedUsernames([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Elimina un usuario guardado
   */
  const removeSavedUser = useCallback(async (username: string): Promise<void> => {
    try {
      const storage = getStorageService()
      await storage.removeUser(username)

      // Actualizar lista local
      setSavedUsernames((prev) => prev.filter((u) => u !== username))
    } catch (error) {
      console.error('Error removing saved user:', error)
    }
  }, [])

  /**
   * Cargar usuarios al montar el componente
   */
  useEffect(() => {
    loadSavedUsers().catch((err) => {
      console.error('Error loading saved users:', err)
    })
  }, [loadSavedUsers])

  return {
    savedUsernames,
    isLoading,
    removeSavedUser,
    reloadSavedUsers: loadSavedUsers,
  }
}
