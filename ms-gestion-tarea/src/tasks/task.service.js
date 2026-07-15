import Task from './task.model.js';

class TaskService {
  async getAllTasks(filters = {}, userId = null) {
    const searchQuery = {};

    if (filters.titulo) {
      searchQuery.titulo = { $regex: filters.titulo, $options: 'i' };
    }
    if (filters.estado) {
      searchQuery.estado = filters.estado;
    }
    if (filters.prioridad) {
      searchQuery.prioridad = filters.prioridad;
    }

    const visibilityQuery = userId
      ? { $or: [{ isPublic: true }, { userId }] }
      : { isPublic: true };

    return Task.find({ $and: [searchQuery, visibilityQuery] });
  }

  async getTaskById(id) {
    return Task.findById(id);
  }

  async createTask(data) {
    return Task.create(data);
  }

  async updateTask(id, data) {
    return Task.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteTask(id) {
    return Task.findByIdAndDelete(id);
  }

  async updateTaskStatus(id, estado) {
    return Task.findByIdAndUpdate(id, { estado }, { new: true, runValidators: true });
  }
}

export const taskService = new TaskService();
export default TaskService;
