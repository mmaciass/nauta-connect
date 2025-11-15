import { create } from 'zustand'
import type { TimeLeft } from '@/domain/entities'

/**
 * Session State
 */
interface SessionState {
  isUpdating: boolean
  lastUpdate: Date | null
  timeLeft: TimeLeft | null
  elapsedTime: string | null
}

interface SessionActions {
  setUpdating: (isUpdating: boolean) => void
  setTimeLeft: (timeLeft: TimeLeft) => void
  setElapsedTime: (elapsedTime: string) => void
  reset: () => void
}

const initialState: SessionState = {
  isUpdating: false,
  lastUpdate: null,
  timeLeft: null,
  elapsedTime: null,
}

/**
 * Session Store (Zustand)
 *
 * Gestiona el estado de la sesión activa:
 * - Tiempo restante
 * - Tiempo transcurrido
 * - Estado de actualización
 */
export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  ...initialState,

  setUpdating: (isUpdating: boolean) =>
    set({
      isUpdating,
    }),

  setTimeLeft: (timeLeft: TimeLeft) =>
    set({
      timeLeft,
      lastUpdate: new Date(),
      isUpdating: false,
    }),

  setElapsedTime: (elapsedTime: string) =>
    set({
      elapsedTime,
    }),

  reset: () => set(initialState),
}))
