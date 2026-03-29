// src/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ApiResponse } from './utils/ApiResponse.js';
import routes from './routes/index.js';

export const createServer = () => {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Welcome Route
  app.get('/', (_req, res) => {
    res.json(ApiResponse.ok({ 
      name: 'PrintWave API', 
      version: '1.0.0', 
      documentation: '/docs',
      health: '/health' 
    }, 'Welcome to PrintWave API'));
  });

  // Health check
  app.get('/health', (_req, res) => {
    res.json(ApiResponse.ok({ status: 'UP' }, 'Server is healthy'));
  });

  // Swagger Documentation
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Main Routes
  app.use('/api', routes);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json(ApiResponse.error('Resource not found'));
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
