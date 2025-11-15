import { Box, Typography, Chip } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import type { TimeLeft } from '@/domain/entities'

interface TimeDisplayProps {
  timeLeft: TimeLeft
  label?: string
  variant?: 'large' | 'compact'
  showIcon?: boolean
}

/**
 * TimeDisplay Component
 *
 * Muestra el tiempo de forma legible y bonita.
 */
export function TimeDisplay({
  timeLeft,
  label = 'Tiempo restante',
  variant = 'large',
  showIcon = true,
}: TimeDisplayProps) {
  const isLowTime = timeLeft.isLessThan(5) // Menos de 5 minutos

  if (variant === 'compact') {
    return (
      <Chip
        icon={showIcon ? <AccessTimeIcon /> : undefined}
        label={timeLeft.toString()}
        color={isLowTime ? 'warning' : 'primary'}
        size="small"
      />
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      {label && (
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {showIcon && <AccessTimeIcon color={isLowTime ? 'warning' : 'primary'} />}

        <Typography
          variant="h4"
          component="div"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 'bold',
            color: isLowTime ? 'warning.main' : 'primary.main',
          }}
        >
          {timeLeft.toString()}
        </Typography>
      </Box>

      <Typography variant="caption" color="text.secondary">
        {timeLeft.toHumanReadable()}
      </Typography>
    </Box>
  )
}
