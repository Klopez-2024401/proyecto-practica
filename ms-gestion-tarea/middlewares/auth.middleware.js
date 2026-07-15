import jwt from 'jsonwebtoken';

const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  return token || null;
};

export const authMiddleware = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. No se proporcionó el token de autenticación en formato Bearer.'
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. El token proporcionado es inválido o ha expirado.',
      error: error.message
    });
  }
};

export const optionalAuthMiddleware = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. El token proporcionado es inválido o ha expirado.',
      error: error.message
    });
  }
};
