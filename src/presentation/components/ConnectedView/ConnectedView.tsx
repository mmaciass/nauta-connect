import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Divider,
  Stack,
  Chip,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import RefreshIcon from '@mui/icons-material/Refresh'
import PersonIcon from '@mui/icons-material/Person'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useAuth, useSession } from '@/presentation/hooks'
import { TimeDisplay } from '../TimeDisplay'

/**
 * ConnectedView Component
 *
 * Vista que se muestra cuando el usuario está conectado.
 * Muestra información de la sesión y permite hacer logout.
 */
export function ConnectedView() {
  const { session, logout } = useAuth()
  const { timeLeft, elapsedTime, isUpdating, updateTime } = useSession()

  if (!session) {
    return null
  }

  const handleLogout = async (): Promise<void> => {
    try {
      await logout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  const handleRefresh = async (): Promise<void> => {
    try {
      await updateTime()
    } catch (err) {
      console.error('Refresh error:', err)
    }
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card elevation={0} sx={{ bgcolor: 'success.light', color: 'success.contrastText', mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CheckCircleIcon />
            <Typography variant="h6">Conectado</Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon fontSize="small" />
            <Typography variant="body2">{session.username}</Typography>
          </Box>
        </CardContent>
      </Card>

      {timeLeft && (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <TimeDisplay timeLeft={timeLeft} label="Tiempo restante" />

              <IconButton
                onClick={handleRefresh}
                disabled={isUpdating}
                size="small"
                color="primary"
              >
                <RefreshIcon className={isUpdating ? 'rotating' : ''} />
              </IconButton>
            </Box>

            {elapsedTime && (
              <>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    Tiempo conectado
                  </Typography>
                  <Chip label={elapsedTime} size="small" variant="outlined" />
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Stack spacing={1}>
        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          fullWidth
        >
          Desconectar
        </Button>

        <Typography variant="caption" color="text.secondary" align="center">
          La sesión se actualizará automáticamente
        </Typography>
      </Stack>

      <style>
        {`
          @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .rotating {
            animation: rotate 1s linear infinite;
          }
        `}
      </style>
    </Box>
  )
}
