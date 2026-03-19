import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

interface FormCardProps {
  title: string
  children: React.ReactNode
}

export function FormCard({ title, children }: FormCardProps) {
  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardHeader title={title} titleTypographyProps={{ align: 'center' }} />
      <CardContent>{children}</CardContent>
    </Card>
  )
}
