'use strict';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnection } from './db.js';
import taskRoutes from '../src/tasks/task.routes.js';

// Inicializar variables de entorno en la configuración de la app
dotenv.config();

const BASE_PATH = '/api/tasks';

const middlewares = (app) => {
  app.use(express.json());
  app.use(cors());
};

const routes = (app) => {
  // Montar rutas modularizadas del dominio de tareas
  app.use(BASE_PATH, taskRoutes);

  // Endpoint de health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'ms-gestion-tarea (Servicio A)'
    });
  });

  // Manejo de endpoint no encontrado (404)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint no encontrado en ms-gestion-tarea API'
    });
  });
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3003;

  try {
    // Conectar MongoDB
    await dbConnection();

    // Cargar middlewares globales y rutas
    middlewares(app);
    routes(app);

    const server = app.listen(PORT, () => {
      console.log(`\n✅ Servicio A (Gestión de Tareas) iniciado en el puerto ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });

    return server;
  } catch (error) {
    console.error(`❌ Error al iniciar el servidor de tareas: ${error.message}`);
    process.exit(1);
  }
};
