import { Router } from 'express';
import * as authController from './auth.controller.js';
import { authRateLimit } from '../../middlewares/request-limit.js';
import { validateLogin, validarCampos } from '../../middlewares/validator.middleware.js';

const router = Router();

router.post(
  '/login',
  authRateLimit,
  validateLogin,
  validarCampos,
  authController.login
);

export default router;
