import { useEffect, useMemo } from 'react'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Box, Container, Typography, Paper, CircularProgress } from '@mui/material'
import WifiIcon from '@mui/icons-material/Wifi'
import { setupDependencies } from '@/shared/di'
import { useAuth, useTheme } from '@/presentation/hooks'
import { LoginForm, ConnectedView, ThemeSwitcher, ErrorBoundary } from '@/presentation/components'

// Setup dependencies una vez
setupDependencies()

function App() {
  const { isAuthenticated, isLoading, checkSession } = useAuth()
  const { effectiveTheme } = useTheme()

  // Crear tema dinámicamente basado en effectiveTheme
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: effectiveTheme,
          primary: {
            main: '#1976d2',
          },
          secondary: {
            main: '#dc004e',
          },
          success: {
            main: '#2e7d32',
            light: '#4caf50',
            dark: '#1b5e20',
          },
        },
      }),
    [effectiveTheme]
  )

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    checkSession().catch((err) => {
      console.error('Error checking session:', err)
    })
  }, [checkSession])

  return (
    <ErrorBoundary>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container
          maxWidth="sm"
          sx={{
            minWidth: '380px',
            minHeight: '500px',
            padding: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WifiIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  Nauta Connect
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  v2.0 - Conexión rápida y segura
                </Typography>
              </Box>
            </Box>
            <ThemeSwitcher />
          </Box>

          {/* Content */}
          <Box sx={{ width: '100%', minHeight: 300 }}>
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2,
                  py: 8,
                }}
              >
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Verificando sesión...
                </Typography>
              </Box>
            ) : isAuthenticated ? (
              <ConnectedView />
            ) : (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Ingresa tus credenciales de Nauta para conectarte
                </Typography>
                <LoginForm />
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              🚀 Tecnología moderna - Manifest V3 - TypeScript
            </Typography>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
