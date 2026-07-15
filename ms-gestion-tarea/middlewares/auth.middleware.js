import jwt from 'jsonwebtoken';

/**
 * Middleware para validar el JWT en la cabecera 'Authorization' (Bearer token).
 * Si es válido, asocia los datos del usuario decodificados a `req.user` y continúa.
 * Si no es válido o no existe, responde con código HTTP 401 de forma limpia.
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. No se proporcionó el token de autenticación en formato Bearer.'
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. El token de autenticación está vacío.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. El token proporcionado es inválido o ha expirado.',
      error: error.message
    });
  }
};