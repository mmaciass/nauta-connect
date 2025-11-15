import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { Box, Container, Typography, Paper } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Opciones de Nauta Connect
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary">
            Página de configuración - Próximamente
          </Typography>
        </Paper>
      </Container>
    </ThemeProvider>
  )
}

export default App
