import axios from 'axios';

/**
 * Cliente de servicio para consumir el Servicio A (Gestión de Tareas) vía HTTP.
 * Diseñado con timeout defensivo y parseo flexible de respuestas.
 */
class TaskService {
  /**
   * Obtiene todas las tareas del Servicio A.
   * @param {string} token - Bearer JWT para mantener contexto de seguridad.
   */
  async getTasks(token) {
    const tasksServiceUrl = process.env.TASKS_SERVICE_URL;
    if (!tasksServiceUrl) {
      throw new Error('La variable de entorno TASKS_SERVICE_URL no está configurada.');
    }

    // Configuración defensiva con timeout de 5000ms y cabecera Authorization
    const response = await axios.get(`${tasksServiceUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    });

    const data = response.data;

    // Manejo flexible del formato de respuesta
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.tasks)) {
      return data.tasks;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
  }
}

export const taskService = new TaskService();
export default TaskService;
