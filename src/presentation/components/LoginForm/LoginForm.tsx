import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Autocomplete,
} from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import { loginSchema, type LoginFormData } from '@/shared/schemas/loginSchema'
import { useAuth, useSavedUsers } from '@/presentation/hooks'

/**
 * LoginForm Component
 *
 * Formulario de login con validación usando React Hook Form + Zod.
 */
export function LoginForm() {
  const { login, isLoading, error } = useAuth()
  const { savedUsernames } = useSavedUsers()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      await login(data.username, data.password, data.remember)
    } catch (err) {
      // Error es manejado por el hook y mostrado en el Alert
      console.error('Login error:', err)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 1 }}>
          {error}
        </Alert>
      )}

      <Controller
        name="username"
        control={control}
        render={({ field }) => (
          <Autocomplete
            {...field}
            options={savedUsernames}
            freeSolo
            disabled={isLoading}
            onChange={(_, value) => field.onChange(value || '')}
            onInputChange={(_, value) => field.onChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Usuario"
                type="email"
                placeholder="usuario@nauta.com.cu"
                error={!!errors.username}
                helperText={errors.username?.message}
                autoFocus
                autoComplete="username"
              />
            )}
          />
        )}
      />

      <TextField
        {...register('password')}
        label="Contraseña"
        type="password"
        error={!!errors.password}
        helperText={errors.password?.message}
        disabled={isLoading}
        fullWidth
        autoComplete="current-password"
      />

      <FormControlLabel
        control={<Checkbox {...register('remember')} disabled={isLoading} />}
        label="Recordar contraseña"
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
        fullWidth
      >
        {isLoading ? 'Conectando...' : 'Conectar'}
      </Button>
    </Box>
  )
}
