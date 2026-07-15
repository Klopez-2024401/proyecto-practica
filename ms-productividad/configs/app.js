'use strict';

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dbConnection } from './db.js';
import productivityRoutes from '../src/productivity/productivity.routes.js';

// Inicializar variables de entorno en la configuración de la app
dotenv.config();

const BASE_PATH = '/api/productivity';

const middlewares = (app) => {
  app.use(express.json());
  app.use(cors());
};

const routes = (app) => {
  // Montar rutas modularizadas del dominio de productividad
  app.use(BASE_PATH, productivityRoutes);

  // Endpoint de health check
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'ms-productividad (Servicio B)'
    });
  });

  // Manejo de endpoint no encontrado (404)
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Endpoint no encontrado en ms-productividad API'
    });
  });
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT || 3002;

  try {
    // Conectar MongoDB
    await dbConnection();

    // Cargar middlewares globales y rutas
    middlewares(app);
    routes(app);

    const server = app.listen(PORT, () => {
      console.log(`\nServicio B (Gestión de Productividad) iniciado en el puerto ${PORT}`);
      console.log(`Servicio de Tareas (Servicio A) configurado en: ${process.env.TASKS_SERVICE_URL}`);
    });

    return server;
  } catch (error) {
    console.error(`Error al iniciar el servidor de productividad: ${error.message}`);
    process.exit(1);
  }
};
