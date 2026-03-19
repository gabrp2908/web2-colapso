import Stack from '@mui/material/Stack'

interface FormFieldProps {
  children: React.ReactNode
  spacing?: number
}

export function FormField({ children, spacing = 2 }: FormFieldProps) {
  return (
    <Stack spacing={spacing} width="100%">
      {children}
    </Stack>
  )
}
