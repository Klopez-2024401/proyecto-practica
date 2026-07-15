import dotenv from 'dotenv';

dotenv.config();

export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'ChangeThisSecretForServiceAuth256Bits!',
    expiresIn: process.env.JWT_EXPIRES_IN || '30m',
    issuer: process.env.JWT_ISSUER || 'ServiceAuth',
    audience: process.env.JWT_AUDIENCE || 'ServiceAuth',
  },
};
