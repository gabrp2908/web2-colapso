import MuiAlert from '@mui/material/Alert'
import type { AlertProps } from '@mui/material/Alert'

interface AppAlertProps extends AlertProps {
  children?: React.ReactNode
}

export function Alert({ children, ...props }: AppAlertProps) {
  return <MuiAlert {...props}>{children}</MuiAlert>
}
