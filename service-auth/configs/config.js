import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'ChangeThisSecretForServiceAuth256Bits!',
    expiresIn: process.env.JWT_EXPIRES_IN || '30m',
    issuer: process.env.JWT_ISSUER || 'ServiceAuth',
    audience: process.env.JWT_AUDIENCE || 'ServiceAuth',
  },
  cloudinary: {
    folder: process.env.CLOUDINARY_FOLDER || 'service-auth/profiles',
    defaultAvatarUrl:
      process.env.CLOUDINARY_DEFAULT_AVATAR_URL ||
      'https://res.cloudinary.com/dut08rmaz/image/upload/proyecto/profiles/default-avatar_ewzxwx.png',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_ENABLE_SSL !== 'false',
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@proyecto.local',
    fromName: process.env.EMAIL_FROM_NAME || 'Service Auth',
  },
  verification: {
    emailExpiryHours: parseInt(process.env.VERIFICATION_EMAIL_EXPIRY_HOURS || '24'),
    passwordResetExpiryHours: parseInt(process.env.PASSWORD_RESET_EXPIRY_HOURS || '1'),
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};
