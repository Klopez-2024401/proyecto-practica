import Task from './task.model.js';

/**
 * Servicio para encapsular la lógica de acceso a datos de la entidad Task.
 */
class TaskService {
  /**
   * Obtiene todas las tareas registradas en MongoDB.
   * @returns {Promise<Array>} Listado de tareas.
   */
  async getAllTasks() {
    try {
      return await Task.find({});
    } catch (error) {
      console.error('Error en TaskService.getAllTasks:', error.message);
      throw error;
    }
  }
}

export const taskService = new TaskService();
export default TaskService;
