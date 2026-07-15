import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { getTasks } from './task.controller.js';

const router = Router();

// TODO: Descomentar authMiddleware cuando el Servicio de Autenticación y el Frontend estén integrados.
// router.use(authMiddleware);

// Endpoint para consultar tareas
router.get('/', getTasks);

export default router;
