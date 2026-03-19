import MuiButton from '@mui/material/Button'
import type { ButtonProps } from '@mui/material/Button'
import type { ReactNode } from 'react'

interface AppButtonProps extends ButtonProps {
  children: ReactNode
}

export function Button({ children, ...props }: AppButtonProps) {
  return <MuiButton {...props}>{children}</MuiButton>
}
