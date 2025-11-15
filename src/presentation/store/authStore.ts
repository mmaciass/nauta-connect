import { create } from 'zustand'
import type { Session } from '@/domain/entities'

/**
 * Auth State
 */
export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error'

interface AuthState {
  status: AuthStatus
  session: Session | null
  error: string | null
}

interface AuthActions {
  setLoading: () => void
  setAuthenticated: (session: Session) => void
  setError: (error: string) => void
  setIdle: () => void
  clearSession: () => void
  updateSession: (session: Session) => void
}

/**
 * Auth Store (Zustand)
 *
 * Gestiona el estado de autenticación de la aplicación.
 * Mucho más simple que Redux con menos boilerplate.
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  // Initial state
  status: 'idle',
  session: null,
  error: null,

  // Actions
  setLoading: () =>
    set({
      status: 'loading',
      error: null,
    }),

  setAuthenticated: (session: Session) =>
    set({
      status: 'authenticated',
      session,
      error: null,
    }),

  setError: (error: string) =>
    set({
      status: 'error',
      error,
    }),

  setIdle: () =>
    set({
      status: 'idle',
      session: null,
      error: null,
    }),

  clearSession: () =>
    set({
      status: 'idle',
      session: null,
      error: null,
    }),

  updateSession: (session: Session) =>
    set((state) => ({
      session,
      // Mantener el status si ya estaba authenticated
      status: state.status === 'authenticated' ? 'authenticated' : state.status,
    })),
}))
