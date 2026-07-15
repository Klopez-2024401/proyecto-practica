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
 * Validadores para REGISTRO
 */
export const validateRegister = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio.')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres.'),

    body('surname')
        .trim()
        .notEmpty()
        .withMessage('El apellido es obligatorio.')
        .isLength({ min: 2, max: 50 })
        .withMessage('El apellido debe tener entre 2 y 50 caracteres.'),

    body('username')
        .trim()
        .notEmpty()
        .withMessage('El nombre de usuario es obligatorio.')
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres.')
        .matches(/^[a-zA-Z0-9_.-]+$/)
        .withMessage('El nombre de usuario solo puede contener letras, números, guiones, guiones bajos y puntos.'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es obligatorio.')
        .isEmail()
        .withMessage('El correo electrónico no tiene un formato válido.'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener mínimo 8 caracteres.'),

    body('phone')
        .optional({ nullable: true })
        .trim()
        .isLength({ min: 8, max: 8 })
        .withMessage('El teléfono debe tener exactamente 8 dígitos.'),
];

/**
 * Validadores para LOGIN
 */
export const validateLogin = [
    body('emailOrUsername')
        .trim()
        .notEmpty()
        .withMessage('El correo o nombre de usuario es obligatorio.'),

    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria.'),
];

/**
 * Validadores para VERIFICAR CUENTA
 */
export const validateVerifyEmail = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es obligatorio.')
        .isEmail()
        .withMessage('El correo electrónico no tiene un formato válido.'),

    body('token')
        .trim()
        .notEmpty()
        .withMessage('El token de verificación es obligatorio.'),
];

/**
 * Validadores para CAMBIAR CONTRASEÑA (usuario autenticado)
 */
export const validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('La contraseña actual es obligatoria.'),

    body('newPassword')
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria.')
        .isLength({ min: 8 })
        .withMessage('La nueva contraseña debe tener mínimo 8 caracteres.'),
];

/**
 * Validadores para OLVIDÉ MI CONTRASEÑA
 */
export const validateForgotPassword = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es obligatorio.')
        .isEmail()
        .withMessage('El correo electrónico no tiene un formato válido.'),
];

/**
 * Validadores para RESTABLECER CONTRASEÑA (con token del correo)
 */
export const validateResetPassword = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('El correo electrónico es obligatorio.')
        .isEmail()
        .withMessage('El correo electrónico no tiene un formato válido.'),

    body('token')
        .trim()
        .notEmpty()
        .withMessage('El token de restablecimiento es obligatorio.'),

    body('newPassword')
        .notEmpty()
        .withMessage('La nueva contraseña es obligatoria.')
        .isLength({ min: 8 })
        .withMessage('La nueva contraseña debe tener mínimo 8 caracteres.'),
];
