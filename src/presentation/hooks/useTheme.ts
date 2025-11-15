import { useEffect, useState, useCallback, useMemo } from 'react'
import { useConfigStore } from '../store'
import type { ThemeMode } from '../store'
import { getStorageService } from '@/shared/di'

/**
 * useTheme Hook
 *
 * Hook para manejar el tema de la aplicación.
 * - Detecta preferencias del sistema cuando está en modo 'auto'
 * - Persiste la configuración del tema
 * - Proporciona el tema efectivo (resuelto) para usar en la UI
 */
export function useTheme() {
  const { theme, setTheme } = useConfigStore()
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  /**
   * Detecta la preferencia del sistema
   */
  const detectSystemTheme = useCallback((): 'light' | 'dark' => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  }, [])

  /**
   * Calcula el tema efectivo basado en el modo seleccionado
   */
  const effectiveTheme = useMemo((): 'light' | 'dark' => {
    return theme === 'auto' ? systemTheme : theme
  }, [theme, systemTheme])

  /**
   * Cambia el tema y lo persiste
   */
  const changeTheme = useCallback(
    async (newTheme: ThemeMode): Promise<void> => {
      setTheme(newTheme)

      // Persistir en storage
      const storage = getStorageService()
      await storage.setConfig('theme', newTheme)
    },
    [setTheme]
  )

  /**
   * Escuchar cambios en las preferencias del sistema
   */
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (): void => {
      setSystemTheme(detectSystemTheme())
    }

    // Usar addEventListener si está disponible, sino usar addListener (legacy)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handleChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback para navegadores antiguos
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [detectSystemTheme])

  /**
   * Cargar tema guardado al iniciar
   */
  useEffect(() => {
    const loadSavedTheme = async (): Promise<void> => {
      try {
        const storage = getStorageService()
        const savedTheme = await storage.getConfig<ThemeMode>('theme')

        if (savedTheme) {
          setTheme(savedTheme)
        }
      } catch (error) {
        console.error('Error loading saved theme:', error)
      }
    }

    loadSavedTheme().catch((err) => {
      console.error('Error loading theme:', err)
    })
  }, [setTheme])

  return {
    // Estado
    theme, // El modo seleccionado por el usuario (light/dark/auto)
    effectiveTheme, // El tema real aplicado (light/dark)

    // Acciones
    changeTheme,
    detectSystemTheme,
  }
}
