import { create } from 'zustand'

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark' | 'auto'

/**
 * Config State
 */
interface ConfigState {
  theme: ThemeMode
  rememberPassword: boolean
  disableWarnings: boolean
  preventSleep: boolean
}

interface ConfigActions {
  setTheme: (theme: ThemeMode) => void
  toggleRememberPassword: () => void
  toggleWarnings: () => void
  togglePreventSleep: () => void
  loadConfig: (config: Partial<ConfigState>) => void
}

const initialState: ConfigState = {
  theme: 'auto',
  rememberPassword: false,
  disableWarnings: false,
  preventSleep: false,
}

/**
 * Config Store (Zustand)
 *
 * Gestiona la configuración de la aplicación:
 * - Tema (light/dark/auto)
 * - Remember password
 * - Disable warnings
 * - Prevent sleep
 */
export const useConfigStore = create<ConfigState & ConfigActions>((set) => ({
  ...initialState,

  setTheme: (theme: ThemeMode) =>
    set({
      theme,
    }),

  toggleRememberPassword: () =>
    set((state) => ({
      rememberPassword: !state.rememberPassword,
    })),

  toggleWarnings: () =>
    set((state) => ({
      disableWarnings: !state.disableWarnings,
    })),

  togglePreventSleep: () =>
    set((state) => ({
      preventSleep: !state.preventSleep,
    })),

  loadConfig: (config: Partial<ConfigState>) =>
    set((state) => ({
      ...state,
      ...config,
    })),
}))
