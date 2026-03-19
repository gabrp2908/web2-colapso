import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

interface LoadingOverlayProps {
  open: boolean
  message?: string
}

export function LoadingOverlay({ open, message }: LoadingOverlayProps) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress color="inherit" />
      {message && <span>{message}</span>}
    </Backdrop>
  )
}
