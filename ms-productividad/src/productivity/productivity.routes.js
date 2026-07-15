import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {
  getDashboard,
  getOverdueTasks,
  getPrioritySummary
} from './productivity.controller.js';

const router = Router();

// Aplicar el middleware de autenticación a todas las rutas
router.use(authMiddleware);

router.get('/dashboard', getDashboard);
router.get('/tasks/overdue', getOverdueTasks);
router.get('/summary/priorities', getPrioritySummary);

export default router;
