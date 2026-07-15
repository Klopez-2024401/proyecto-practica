import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authRateLimit } from '../../middlewares/request-limit.js';
import { validateRegister, validateLogin, validarCampos } from '../../middlewares/validator.middleware.js';

const router = Router();

router.post(
  '/register',
  authRateLimit,
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

export default router;
