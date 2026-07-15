import axios from 'axios';
import mongoose from 'mongoose';

// Definición ultra-flexible para lectura directa en MongoDB
const taskSchema = new mongoose.Schema({}, { strict: false });
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema, 'tasks');

/**
 * Cliente de servicio para consumir el Servicio A (Gestión de Tareas).
 * Adaptado temporalmente para leer directo de MongoDB sin depender de peticiones HTTP (Axios).
 */
class TaskService {
  /**
   * Obtiene todas las tareas.
   * @param {string} token - Bearer JWT (temporalmente no requerido para consultas directas).
   */
  async getTasks(token) {
    try {
      // MODO DIRECTO DE BASE DE DATOS (Para pruebas sin requerir que Servicio A esté corriendo vía HTTP)
      const tasks = await Task.find({}).lean();
      return tasks;
    } catch (error) {
      console.error('Error al obtener tareas directamente de MongoDB:', error.message);
      throw error;
    }

    /*
    // MODO CONSUMO HTTP (Comentado temporalmente, activar cuando se una el sistema y se requiera Axios)
    const tasksServiceUrl = process.env.TASKS_SERVICE_URL;
    if (!tasksServiceUrl) {
      throw new Error('La variable de entorno TASKS_SERVICE_URL no está configurada.');
    }

    const response = await axios.get(`${tasksServiceUrl}/tasks`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      timeout: 5000
    });

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.tasks)) {
      return data.tasks;
    } else if (data && data.data && Array.isArray(data.data)) {
      return data.data;
    }

    return [];
    */
  }
}

export const taskService = new TaskService();
export default TaskService;
