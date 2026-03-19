# Web 2 Frontend

Frontend de la aplicación Web 2 construido con React 19, Vite, TypeScript y Material UI.

## Requisitos Previos

- Node.js 20+
- Backend (`web-2-backend`) ejecutándose en `http://localhost:3000`

## Instalación

```bash
# Instalar dependencias
npm install
# o
pnpm install
# o
bun install
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:3000
```

## Scripts Disponibles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview

# Linting
npm run lint
```

## Arquitectura del Proyecto

```
src/
├── api/                    # Cliente API (Axios)
│   ├── axios-client.ts     # Instancia de Axios configurada
│   ├── toProccess.ts       # Wrapper para transacciones
│   └── auth.ts             # Funciones de autenticación
├── components/
│   ├── ui/                 # Componentes UI base (MUI)
│   └── layout/             # Layout principal
├── context/
│   └── AuthContext.tsx     # Contexto de autenticación
├── hooks/
│   ├── useTx.ts            # Hook para ejecutar transacciones
│   └── useAuth.ts          # Hook helper de autenticación
├── pages/                  # Páginas de la aplicación
├── router/                 # Configuración de rutas
├── types/                  # Tipos TypeScript
└── config/                 # Configuración de tema, etc.
```

## Flujo de Autenticación

1. El usuario visita `/login`
2. Se obtiene el token CSRF del backend
3. Se envían credenciales a `POST /login`
4. El backend crea sesión y devuelve cookie
5. El frontend guarda el usuario en AuthContext
6. Rutas protegidas redirigen a login si no hay sesión

## Transacciones (toProccess)

El backend usa un sistema de transacciones. Para llamar una transacción:

```typescript
import { useTx } from '@/hooks'

const TX_AUTH_LOGIN = 1001

function MyComponent() {
  const { executeTx, loading, error } = useTx<void>(TX_AUTH_LOGIN)
  
  const handleAction = async () => {
    const result = await executeTx({ email: 'test@test.com' })
    // result contiene la respuesta de la transacción
  }
  
  return <button onClick={handleAction} disabled={loading}>Ejecutar</button>
}
```

## Conexión con el Backend

El frontend está configurado con un proxy en desarrollo que reenvía:
- `/toProccess` → Backend
- `/login` → Backend
- `/logout` → Backend
- `/csrf` → Backend

Para producción, configura `VITE_API_URL` con la URL del backend.
