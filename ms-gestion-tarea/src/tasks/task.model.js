'use strict';
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título de la tarea es requerido'],
      trim: true,
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción de la tarea es requerida'],
      trim: true,
    },
    prioridad: {
      type: String,
      enum: {
        values: ['Baja', 'Media', 'Alta'],
        message: '{VALUE} no es una prioridad válida (debe ser Baja, Media o Alta)'
      },
      required: [true, 'La prioridad de la tarea es requerida'],
      trim: true,
    },
    estado: {
      type: String,
      enum: {
        values: ['Pendiente', 'En progreso', 'Completada'],
        message: '{VALUE} no es un estado válido (debe ser Pendiente, En progreso o Completada)'
      },
      default: 'Pendiente',
      required: [true, 'El estado de la tarea es requerido'],
      trim: true,
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha límite de la tarea es requerida'],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
      required: [true, 'El ID de usuario es requerido para asociar la tarea'],
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

taskSchema.index({ estado: 1, prioridad: 1, userId: 1 });

export default mongoose.model('Task', taskSchema);
