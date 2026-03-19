import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '@/context/AuthContext'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="body1" gutterBottom>
        Bienvenido, {user?.user_em || 'Usuario'}
      </Typography>

      {user && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="body2">
            <strong>ID:</strong> {user.user_id}
          </Typography>
          <Typography variant="body2">
            <strong>Email:</strong> {user.user_em}
          </Typography>
          <Typography variant="body2">
            <strong>Activo:</strong> {user.user_act ? 'Sí' : 'No'}
          </Typography>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <Button variant="contained" color="primary" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  )
}
