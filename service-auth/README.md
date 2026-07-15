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

  # MongoDB
  MONGODB_URI=mongodb://127.0.0.1:27017/Kairo

  JWT_SECRET=ChangeThisSecretForServiceAuth256Bits!
  JWT_EXPIRES_IN=30m
  JWT_ISSUER=ServiceAuth
  JWT_AUDIENCE=ServiceAuth

  # CORS
  ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

  # Cloudinary (fotos de perfil)
  CLOUDINARY_CLOUD_NAME=dut08rmaz
  CLOUDINARY_API_KEY=279612751725163
  CLOUDINARY_API_SECRET=UxGMRqU1iB580Kxb2AlDR4n4hu0
  CLOUDINARY_FOLDER=service-auth/profiles
  CLOUDINARY_DEFAULT_AVATAR_URL=https://res.cloudinary.com/dut08rmaz/image/upload/proyecto/profiles/default-avatar_ewzxwx.png

  # SMTP (verificación de cuenta y recuperación de contraseña)
  SMTP_HOST=smtp.gmail.com
  SMTP_PORT=465
  SMTP_ENABLE_SSL=true
  SMTP_USERNAME=narutoshippude745@gmail.com
  SMTP_PASSWORD=rhcs dgno ywts egrt
  EMAIL_FROM=narutoshippude745@gmail.com
  EMAIL_FROM_NAME=Service Auth

  # Tokens de verificación / reset (en horas)
  VERIFICATION_EMAIL_EXPIRY_HOURS=24
  PASSWORD_RESET_EXPIRY_HOURS=1

  # Frontend (para armar los enlaces de los correos)
  FRONTEND_URL=http://localhost:5173
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
  "username": "juanp",
  "email": "juan@example.com",
  "password": "MiPassword123",
  "phone": "12345678"
}
```

### Login

Acepta `email` o `username` en el mismo campo `emailOrUsername`:

```json
POST /api/v1/auth/login
{
  "emailOrUsername": "juan@example.com",
  "password": "MiPassword123"
}
```

Respuesta:

```json
{
  "success": true,
  "message": "Login exitoso",
  "token": "<jwt>",
  "user": { "id": "...", "name": "Juan", "surname": "Pérez", "username": "juanp", "email": "juan@example.com", "..." }
}
```

## Usuario de prueba

```bash
npm run seed
```

Crea (de forma idempotente) un usuario ya activo/verificado para pruebas:

- Correo: `test@kairo.com`
- Usuario: `usuario_prueba`
- Contraseña: `Test1234!`

Este mensaje también se imprime cada vez que el servicio arranca en modo `development`.

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
