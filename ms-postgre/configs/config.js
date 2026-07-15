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
};
