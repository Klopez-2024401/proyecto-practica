import { Router } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '../../middlewares/auth.middleware.js';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from './task.controller.js';

const router = Router();

router.get('/', optionalAuthMiddleware, getTasks);
router.get('/:id', optionalAuthMiddleware, getTaskById);
router.post('/', authMiddleware, createTask);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);
router.patch('/:id/status', authMiddleware, updateTaskStatus);

export default router;
