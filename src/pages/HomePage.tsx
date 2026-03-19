import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export function HomePage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" gutterBottom>
        Bienvenido a Web 2
      </Typography>
      <Typography variant="body1" gutterBottom color="text.secondary">
        Una aplicación construida con React, TypeScript y Material UI
      </Typography>
      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/login"
        >
          Iniciar Sesión
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          to="/register"
        >
          Registrarse
        </Button>
      </Box>
    </Box>
  )
}
