import { taskService } from './productivity.service.js';
import Productivity from './productivity.model.js';

/**
 * Función auxiliar para calcular las métricas agregadas de las tareas de forma centralizada.
 * Controla divisiones por cero y formatea los porcentajes a 2 decimales.
 */
const calculateMetrics = (tasks) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.estado === 'Completada').length;
  const pendingTasks = totalTasks - completedTasks;

  const completedPercentage = totalTasks > 0
    ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(2))
    : 0;

  const pendingPercentage = totalTasks > 0
    ? parseFloat(((pendingTasks / totalTasks) * 100).toFixed(2))
    : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completedPercentage,
    pendingPercentage
  };
};

/**
 * Obtiene las tareas del Servicio A y calcula estadísticas del dashboard.
 */
export const getDashboard = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 'dummy_token';
    const tasks = await taskService.getTasks(token);
    const metrics = calculateMetrics(tasks);

    return res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error en getDashboard:', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudo obtener el dashboard de productividad debido a un error de comunicación.',
      error: error.message
    });
  }
};

/**
 * Filtra y retorna las tareas cuya fecha límite ya pasó y su estado no sea "Completada".
 */
export const getOverdueTasks = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 'dummy_token';
    const tasks = await taskService.getTasks(token);

    const now = new Date();
    const overdueTasks = tasks.filter(task => {
      if (!task.fecha) return false;
      const deadline = new Date(task.fecha);
      const isOverdue = deadline < now;
      const isNotCompleted = task.estado !== 'Completada';
      return isOverdue && isNotCompleted;
    });

    return res.status(200).json({
      success: true,
      data: overdueTasks
    });
  } catch (error) {
    console.error('Error en getOverdueTasks:', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudieron obtener las tareas atrasadas debido a un error de comunicación.',
      error: error.message
    });
  }
};

/**
 * Agrupa y cuenta las tareas por prioridad normalizando a minúsculas.
 */
export const getPrioritySummary = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 'dummy_token';
    const tasks = await taskService.getTasks(token);

    const summary = {
      baja: 0,
      media: 0,
      alta: 0
    };

    tasks.forEach(task => {
      const priority = (task.prioridad || task.priority || '')
        .toString()
        .toLowerCase()
        .trim();

      if (priority === 'baja') {
        summary.baja++;
      } else if (priority === 'media') {
        summary.media++;
      } else if (priority === 'alta') {
        summary.alta++;
      } else if (priority) {
        if (!summary[priority]) {
          summary[priority] = 0;
        }
        summary[priority]++;
      }
    });

    return res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error en getPrioritySummary:', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudo obtener el resumen de prioridades debido a un error de comunicación.',
      error: error.message
    });
  }
};

/**
 * Obtiene las tareas pendientes (estado NO sea "Completada").
 */
export const getPendingTasks = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 'dummy_token';
    const tasks = await taskService.getTasks(token);

    const pendingTasks = tasks.filter(task => task.estado !== 'Completada');

    return res.status(200).json({
      success: true,
      data: pendingTasks
    });
  } catch (error) {
    console.error('Error en getPendingTasks:', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudieron obtener las tareas pendientes debido a un error de comunicación.',
      error: error.message
    });
  }
};

/**
 * Calcula y devuelve exclusivamente las estadísticas de completación de tareas.
 */
export const getCompletionStatistics = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || 'dummy_token';
    const tasks = await taskService.getTasks(token);
    const { totalTasks, completedTasks, completedPercentage } = calculateMetrics(tasks);

    return res.status(200).json({
      success: true,
      data: {
        totalTasks,
        completedTasks,
        completedPercentage
      }
    });
  } catch (error) {
    console.error('Error en getCompletionStatistics:', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudieron obtener las estadísticas de completación debido a un error de comunicación.',
      error: error.message
    });
  }
};

/**
 * Guarda las métricas en el historial del usuario.
 * Si no se envían los datos en el body, se calculan en caliente llamando al Servicio A.
 */
export const saveHistory = async (req, res) => {
  try {
    const userId = req.user.sub;
    let {
      totalTareas,
      completadasTareas,
      pendientesTareas,
      porcentajeCompletadas,
      porcentajePendientes,
      fechaCalculo
    } = req.body || {};

    // Si no se provee la información, se calcula llamando a ms-gestion-tarea
    if (totalTareas === undefined) {
      const token = req.headers.authorization?.split(' ')[1] || 'dummy_token';
      const tasks = await taskService.getTasks(token);
      const metrics = calculateMetrics(tasks);

      totalTareas = metrics.totalTasks;
      completadasTareas = metrics.completedTasks;
      pendientesTareas = metrics.pendingTasks;
      porcentajeCompletadas = metrics.completedPercentage;
      porcentajePendientes = metrics.pendingPercentage;
    }

    const newHistory = new Productivity({
      usuarioId: userId,
      totalTareas,
      completadasTareas,
      pendientesTareas,
      porcentajeCompletadas,
      porcentajePendientes,
      fechaCalculo: fechaCalculo || new Date()
    });

    await newHistory.save();

    return res.status(201).json({
      success: true,
      message: 'Métricas de productividad guardadas con éxito en el historial.',
      data: newHistory
    });
  } catch (error) {
    console.error('Error en saveHistory (Controlador):', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudo guardar el registro en el historial de productividad.',
      error: error.message
    });
  }
};

/**
 * Obtiene el historial completo de métricas de productividad guardadas del usuario.
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.sub;
    const history = await Productivity.find({ usuarioId: userId }).sort({ fechaCalculo: -1 });

    return res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error en getHistory (Controlador):', error.message);
    return res.status(500).json({
      success: false,
      message: 'No se pudo obtener el historial de productividad.',
      error: error.message
    });
  }
};
