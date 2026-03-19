import { AuthProvider } from '@/context'
import { AppThemeProvider } from '@/config'
import { AppRouter } from '@/router'

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </AppThemeProvider>
  )
}

export default App
