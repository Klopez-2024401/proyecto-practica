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
import authRoutes from '../src/auth/auth.routes.js';

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
  app.use(`${BASE_PATH}/auth`, authRoutes);

  app.get(`${BASE_PATH}/health`, (req, res) => {
    res.status(200).json({
      status: 'Healthy',
      timestamp: new Date().toISOString(),
      service: 'Service Auth',
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

    app.use(notFound);
    app.use(errorMiddleware);

    app.use(errorHandler);

    const server = app.listen(PORT, () => {
      console.log(`\n✅ Service Auth running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    return server;
  } catch (error) {
    console.error(`\n❌ Error starting server:`, error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};
