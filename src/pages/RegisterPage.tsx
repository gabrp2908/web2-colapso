import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FormCard, TextField, Button, Alert, FormField } from '@/components/ui'
import { useTx } from '@/hooks'

const TX_REGISTER = 1002

export function RegisterPage() {
  const navigate = useNavigate()
  const { executeTx, loading, error } = useTx<void>(TX_REGISTER)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSuccess(false)

    const result = await executeTx({ email, password, name: name || undefined })

    if (result !== undefined) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    }
  }

  return (
    <Box>
      <FormCard title="Registrarse">
        <form onSubmit={handleSubmit}>
          <FormField spacing={2}>
            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success">
                ¡Registro exitoso! Redirigiendo al login...
              </Alert>
            )}

            <TextField
              label="Nombre"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              helperText="Mínimo 8 caracteres"
              fullWidth
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || success}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>

            <Typography variant="body2" align="center">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login">Inicia sesión</Link>
            </Typography>
          </FormField>
        </form>
      </FormCard>
    </Box>
  )
}
