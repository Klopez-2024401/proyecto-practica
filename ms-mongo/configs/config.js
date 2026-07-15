import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'MyVerySecretKeyForJWTTokenAuthenticationWith256Bits!',
    expiresIn: process.env.JWT_EXPIRES_IN || '120m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'Proyecto',
    audience: process.env.JWT_AUDIENCE || 'Proyecto',
  },
  upload: {
    uploadPath: process.env.UPLOAD_PATH || './uploads',
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@proyecto.local',
    fromName: process.env.EMAIL_FROM_NAME || 'Proyecto',
  },
  verification: {
    emailExpiryHours: parseInt(process.env.VERIFICATION_EMAIL_EXPIRY_HOURS || '24'),
    passwordResetExpiryHours: parseInt(process.env.PASSWORD_RESET_EXPIRY_HOURS || '1'),
  },
  postgresApi: {
    baseUrl: process.env.POSTGRES_API_URL || 'http://localhost:3007/api/v1',
  },
};
