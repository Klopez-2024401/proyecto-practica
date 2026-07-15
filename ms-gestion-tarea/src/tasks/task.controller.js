import mongoose from 'mongoose';
import { taskService } from './task.service.js';

const isOwner = (task, userId) => Boolean(userId) && task.userId === userId;

const isVisible = (task, userId) => task.isPublic || isOwner(task, userId);

const handleError = (res, error, message) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Datos de la tarea inválidos.',
      error: error.message
    });
  }
  console.error(message, error.message);
  return res.status(500).json({
    success: false,
    message,
    error: error.message
  });
};

export const getTasks = async (req, res) => {
  try {
    const { titulo, estado, prioridad } = req.query;
    const userId = req.user?.sub ?? null;

    const tasks = await taskService.getAllTasks({ titulo, estado, prioridad }, userId);
    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    return handleError(res, error, 'No se pudieron obtener las tareas de la base de datos.');
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'El ID de la tarea no es válido.' });
    }

    const task = await taskService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
    }

    const userId = req.user?.sub ?? null;
    if (!isVisible(task, userId)) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta tarea.' });
    }

    return res.status(200).json({ success: true, data: task });
  } catch (error) {
    return handleError(res, error, 'No se pudo obtener la tarea solicitada.');
  }
};

export const createTask = async (req, res) => {
  try {
    const { titulo, descripcion, prioridad, estado, fecha, isPublic } = req.body;

    const task = await taskService.createTask({
      titulo,
      descripcion,
      prioridad,
      estado,
      fecha,
      isPublic,
      userId: req.user.sub,
    });

    return res.status(201).json({ success: true, data: task });
  } catch (error) {
    return handleError(res, error, 'No se pudo crear la tarea.');
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'El ID de la tarea no es válido.' });
    }

    const existingTask = await taskService.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
    }
    if (!isOwner(existingTask, req.user.sub)) {
      return res.status(403).json({ success: false, message: 'Solo el dueño de la tarea puede editarla.' });
    }

    const { titulo, descripcion, prioridad, estado, fecha, isPublic } = req.body;
    const updatedTask = await taskService.updateTask(id, { titulo, descripcion, prioridad, estado, fecha, isPublic });

    return res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    return handleError(res, error, 'No se pudo actualizar la tarea.');
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'El ID de la tarea no es válido.' });
    }

    const existingTask = await taskService.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
    }
    if (!isOwner(existingTask, req.user.sub)) {
      return res.status(403).json({ success: false, message: 'Solo el dueño de la tarea puede eliminarla.' });
    }

    await taskService.deleteTask(id);
    return res.status(200).json({ success: true, message: 'Tarea eliminada correctamente.' });
  } catch (error) {
    return handleError(res, error, 'No se pudo eliminar la tarea.');
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'El ID de la tarea no es válido.' });
    }

    const existingTask = await taskService.getTaskById(id);
    if (!existingTask) {
      return res.status(404).json({ success: false, message: 'Tarea no encontrada.' });
    }
    if (!isOwner(existingTask, req.user.sub)) {
      return res.status(403).json({ success: false, message: 'Solo el dueño de la tarea puede cambiar su estado.' });
    }

    const updatedTask = await taskService.updateTaskStatus(id, req.body.estado);
    return res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    return handleError(res, error, 'No se pudo actualizar el estado de la tarea.');
  }
};
