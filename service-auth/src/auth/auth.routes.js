import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authRateLimit } from '../../middlewares/request-limit.js';
import {
  validateRegister,
  validateLogin,
  validateVerifyEmail,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validarCampos,
} from '../../middlewares/validator.middleware.js';
import { autenticar } from '../../middlewares/auth.middleware.js';
import { uploadProfilePicture } from '../../middlewares/upload.middleware.js';

const router = Router();

router.post(
  '/register',
  authRateLimit,
  uploadProfilePicture,
  validateRegister,
  validarCampos,
  authController.register
);

router.post(
  '/login',
  authRateLimit,
  validateLogin,
  validarCampos,
  authController.login
);

router.post(
  '/verify-email',
  authRateLimit,
  validateVerifyEmail,
  validarCampos,
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  authRateLimit,
  validateForgotPassword,
  validarCampos,
  authController.resendVerification
);

router.post(
  '/forgot-password',
  authRateLimit,
  validateForgotPassword,
  validarCampos,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  authRateLimit,
  validateResetPassword,
  validarCampos,
  authController.resetPassword
);

router.patch(
  '/change-password',
  autenticar,
  validateChangePassword,
  validarCampos,
  authController.changePassword
);

router.patch(
  '/profile-picture',
  autenticar,
  uploadProfilePicture,
  authController.updateProfilePicture
);

export default router;
