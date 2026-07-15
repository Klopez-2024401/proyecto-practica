'use strict';
import mongoose from 'mongoose';

const productivitySchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El ID de usuario es requerido para asociar el historial de productividad'],
    },
    totalTareas: {
      type: Number,
      required: [true, 'El conteo total de tareas es requerido'],
      min: [0, 'El total de tareas no puede ser menor a cero']
    },
    completadasTareas: {
      type: Number,
      required: [true, 'El total de tareas completadas es requerido'],
      min: [0, 'El total de tareas completadas no puede ser menor a cero']
    },
    pendientesTareas: {
      type: Number,
      required: [true, 'El total de tareas pendientes es requerido'],
      min: [0, 'El total de tareas pendientes no puede ser menor a cero']
    },
    porcentajeCompletadas: {
      type: Number,
      required: [true, 'El porcentaje de tareas completadas es requerido'],
      min: [0, 'El porcentaje no puede ser menor a 0'],
      max: [100, 'El porcentaje no puede exceder 100']
    },
    porcentajePendientes: {
      type: Number,
      required: [true, 'El porcentaje de tareas pendientes es requerido'],
      min: [0, 'El porcentaje no puede ser menor a 0'],
      max: [100, 'El porcentaje no puede exceder 100']
    },
    fechaCalculo: {
      type: Date,
      default: Date.now,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índice para búsquedas rápidas por usuario e historial ordenado por fecha de cálculo
productivitySchema.index({ usuarioId: 1, fechaCalculo: -1 });

export default mongoose.model('Productivity', productivitySchema);
