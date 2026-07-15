# service-auth

Servicio de Autenticación independiente del sistema. Maneja registro, inicio de sesión y emisión de JWT para los usuarios del sistema. Usa MongoDB (Mongoose) y argon2 para el hash de contraseñas.

## Requisitos

- Node.js 18+
- MongoDB corriendo (local o remoto)

## Configuración

Copia/ajusta el archivo `.env` con tus valores:

```
NODE_ENV=development
PORT=4001
MONGODB_URI=mongodb://localhost:27017/service_auth_db
JWT_SECRET=...
JWT_EXPIRES_IN=30m
JWT_ISSUER=ServiceAuth
JWT_AUDIENCE=ServiceAuth
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Instalación y ejecución

```bash
npm install
npm run dev
```

El servicio queda disponible en `http://localhost:4001/api/v1`.

## Endpoints

- `GET /api/v1/health` — verifica que el servicio está corriendo.
- `POST /api/v1/auth/register` — registra un nuevo usuario.
- `POST /api/v1/auth/login` — inicia sesión y retorna un JWT.

### Registro

```json
POST /api/v1/auth/register
{
  "name": "Juan",
  "surname": "Pérez",
  "email": "juan@example.com",
  "password": "MiPassword123",
  "phone": "12345678"
}
```

### Login

```json
POST /api/v1/auth/login
{
  "email": "juan@example.com",
  "password": "MiPassword123"
}
```

Respuesta:

```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "<jwt>",
  "user": { "id": "...", "name": "Juan", "surname": "Pérez", "email": "juan@example.com", "..." }
}
```

## Estructura

```
service-auth/
├── configs/        # arranque, conexión a Mongo, CORS, helmet
├── helper/         # generación/verificación de JWT
├── utils/          # hash y verificación de contraseñas (argon2)
├── middlewares/    # manejo de errores, rate limit, validaciones, auth JWT
├── src/
│   └── auth/       # modelo, service, controller y rutas del módulo de auth
├── index.js
└── package.json
```
