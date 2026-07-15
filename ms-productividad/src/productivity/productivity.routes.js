import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import {
  getDashboard,
  getOverdueTasks,
  getPrioritySummary,
  getPendingTasks,
  getCompletionStatistics,
  saveHistory,
  getHistory
} from './productivity.controller.js';

const router = Router();

// Aplicar el middleware de autenticación a todas las rutas
router.use(authMiddleware);

router.get('/dashboard', getDashboard);
router.get('/tasks/pending', getPendingTasks);
router.get('/tasks/overdue', getOverdueTasks);
router.get('/summary/priorities', getPrioritySummary);
router.get('/statistics/completion', getCompletionStatistics);

// Endpoints del historial de productividad
router.post('/history', saveHistory);
router.get('/history', getHistory);

export default router;
