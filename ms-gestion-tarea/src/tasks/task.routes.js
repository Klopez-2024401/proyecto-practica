import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { getTasks } from './task.controller.js';

const router = Router();

// Aplicar el middleware de autenticación a todas las rutas de tareas
router.use(authMiddleware);

// Endpoint para consultar tareas
router.get('/', getTasks);

export default router;
