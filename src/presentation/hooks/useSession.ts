import { useEffect, useCallback } from 'react'
import { useSessionStore, useAuthStore } from '../store'
import { getSessionManager } from '@/shared/di'

/**
 * useSession Hook
 *
 * Hook personalizado para manejar el estado de la sesión activa.
 * - Actualiza el tiempo restante periódicamente
 * - Actualiza el tiempo transcurrido
 * - Escucha mensajes del service worker
 */
export function useSession() {
  const { timeLeft, elapsedTime, isUpdating, setUpdating, setTimeLeft, setElapsedTime, reset } =
    useSessionStore()

  const { session, updateSession } = useAuthStore()

  /**
   * Actualiza el tiempo restante manualmente
   */
  const updateTime = useCallback(async (): Promise<void> => {
    if (!session) return

    setUpdating(true)

    try {
      const sessionManager = getSessionManager()
      const updatedSession = await sessionManager.updateRemainingTime()

      if (updatedSession) {
        setTimeLeft(updatedSession.timeLeft)
        updateSession(updatedSession)
      }
    } catch (err) {
      console.error('Error updating time:', err)
    } finally {
      setUpdating(false)
    }
  }, [session, setUpdating, setTimeLeft, updateSession])

  /**
   * Actualiza el tiempo transcurrido
   */
  const updateElapsed = useCallback((): void => {
    if (!session) return

    const elapsed = session.elapsedTime.toHumanReadable()
    setElapsedTime(elapsed)
  }, [session, setElapsedTime])

  /**
   * Escuchar mensajes del service worker
   */
  useEffect(() => {
    const handleMessage = (message: { type: string; payload?: unknown }): void => {
      if (message.type === 'session:updated' && message.payload) {
        // Actualizar el tiempo desde el background
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sessionData = message.payload as any
        if (sessionData.timeLeft) {
          const { TimeLeft } = require('@/domain/entities')
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          const newTimeLeft = TimeLeft.fromString(sessionData.timeLeft)
          setTimeLeft(newTimeLeft)
        }
      } else if (message.type === 'session:expired') {
        reset()
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [setTimeLeft, reset])

  /**
   * Actualizar tiempo transcurrido cada segundo
   */
  useEffect(() => {
    if (!session) return

    updateElapsed()

    const interval = setInterval(() => {
      updateElapsed()
    }, 1000)

    return () => clearInterval(interval)
  }, [session, updateElapsed])

  /**
   * Cargar tiempo inicial cuando hay sesión
   */
  useEffect(() => {
    if (session && !timeLeft) {
      setTimeLeft(session.timeLeft)
    }
  }, [session, timeLeft, setTimeLeft])

  return {
    // State
    timeLeft,
    elapsedTime,
    isUpdating,

    // Actions
    updateTime,
    reset,
  }
}
