# Configuración del Backend para el Frontend

## Prerequisites del Backend

1. **PostgreSQL** ejecutándose (puerto 5441 por defecto según .env.example)
2. **Migraciones ejecutadas**: `pnpm run db`
3. **Usuario admin creado**

## Configuración de Variables de Entorno

En `web-2-backend/.env`:

```env
# Puerto del servidor
APP_PORT=3000

# CORS - Agregar el puerto del frontend
CORS_ENABLED=true
CORS_ORIGINS=http://localhost:5173

# Frontend mode (none, spa, pages)
APP_FRONTEND_MODE=none
```

## Crear Usuario Admin

```bash
cd web-2-backend

# Usar el CLI interactivo
pnpm run db

# Seleccionar opción de crear usuario
# O usar el seeder directo:
node --import tsx scripts/db/seeders/admin.ts
```

## Iniciar el Backend

```bash
cd web-2-backend
pnpm run dev
```

## Transacciones Disponibles

Basado en los BOs del backend:

### Auth (1-8)
- `1`: Login
- `2`: Register
- `3`: Verify Email
- `4`: Request Email Verification
- `5`: Request Password Reset
- `6`: Verify Password Reset
- `7`: Reset Password
- `8`: Request Username

### Component (primera TX disponible después de Auth)
- Busca las TX registradas ejecutando: `pnpm run db` → Status

## Verificar Conexión

1. Inicia el backend: `pnpm run dev` (debería escuchar en puerto 3000)
2. Inicia el frontend: `npm run dev` (puerto 5173)
3. Abre http://localhost:5173
4. Intenta hacer login con las credenciales creadas
