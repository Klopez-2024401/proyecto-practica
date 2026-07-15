import { body, validationResult } from 'express-validator';

/**
 * Middleware para validar errores de validación
 * Debe ser usado DESPUÉS de todos los validadores
 */
export const validarCampos = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Errores de validación',
            errors: errors.array().map(error => ({
                field: error.param,
                message: error.msg,
            }))
        });
    }

    next();
};

/**
 * Validadores para LOGIN
 * Incluye validaciones de email/username y contraseña
 */
export const validateLogin = [
    // Validación de Email o Username
    body('emailOrUsername')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico o nombre de usuario es obligatorio.')
        .isLength({ min: 3 })
        .withMessage('El correo electrónico o nombre de usuario debe tener mínimo 3 caracteres.'),

    // Validación de Contraseña
    body('password')
        .trim()
        .notEmpty()
        .withMessage('La contraseña es obligatoria.')
        .isLength({ min: 1 })
        .withMessage('La contraseña no puede estar vacía.'),
];
