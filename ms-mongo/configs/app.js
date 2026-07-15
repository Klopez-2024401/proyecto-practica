'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectMongoDB } from './mongodb.js';
import { corsOptions } from './cors-configuration.js';
import { helmetConfiguration } from './helmet-configuration.js';
import { requestLimit } from '../middlewares/request-limit.js';
import {
  errorHandler,
  notFound,
} from '../middlewares/server-genericError-handler.js';
import { errorMiddleware } from '../middlewares/error.middleware.js';
import { initSocket } from './socket.js';
import { setupSwagger } from './swagger.js';

const BASE_PATH = '/api/v1';

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false, limit: '10mb' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(cors(corsOptions));
  app.use(helmet(helmetConfiguration));
  app.use(requestLimit);
  app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));
};

const routes = (app) => {
  // Las rutas de dominio de este servicio se agregan aquí a medida
  // que se defina el proyecto.

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Proyecto - Mongo Service',
    });
  });
};

export const initServer = async () => {
  const app = express();
  const PORT = process.env.PORT;
  app.set('trust proxy', 1);

  try {
    // Conectar MongoDB
    await connectMongoDB();

    middlewares(app);
    routes(app);

    // Swagger UI disponible en /swagger
    setupSwagger(app);

    app.use(notFound);
    app.use(errorMiddleware);

    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`\n✅ Proyecto API (Mongo) running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Inicializar Socket.io
    const io = initSocket(server);
    console.log('🔌 Socket.io inicializado');

    return server;
  } catch (error) {
    console.error(`\n❌ Error starting server:`, error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};
