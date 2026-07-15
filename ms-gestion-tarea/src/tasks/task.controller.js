import { taskService } from './task.service.js';

/**
 * Endpoint para obtener todas las tareas de la base de datos.
 * Responde con HTTP 200 y el listado de tareas en formato JSON, o HTTP 500 en caso de error.
 */
export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    return res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error en getTasks (Controlador):', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudieron obtener las tareas de la base de datos.',
      error: error.message
    });
  }
};
