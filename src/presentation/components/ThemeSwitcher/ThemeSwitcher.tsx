import { type ReactElement } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto'
import { useTheme } from '@/presentation/hooks'
import type { ThemeMode } from '@/presentation/store'

/**
 * ThemeSwitcher Component
 *
 * Botón para cambiar entre temas: light, dark, auto
 */
export function ThemeSwitcher() {
  const { theme, changeTheme } = useTheme()

  const handleClick = (): void => {
    // Ciclar entre los tres modos
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'

    changeTheme(nextTheme).catch((err) => {
      console.error('Error changing theme:', err)
    })
  }

  const getIcon = (): ReactElement => {
    switch (theme) {
      case 'light':
        return <LightModeIcon />
      case 'dark':
        return <DarkModeIcon />
      case 'auto':
        return <BrightnessAutoIcon />
    }
  }

  const getTooltip = (): string => {
    switch (theme) {
      case 'light':
        return 'Tema claro'
      case 'dark':
        return 'Tema oscuro'
      case 'auto':
        return 'Tema automático'
    }
  }

  return (
    <Tooltip title={getTooltip()}>
      <IconButton onClick={handleClick} size="small" color="inherit">
        {getIcon()}
      </IconButton>
    </Tooltip>
  )
}
