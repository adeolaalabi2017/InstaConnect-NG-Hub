import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middleware/errorHandler';
import { corsOptions } from './config/cors';
import routes from './routes';

// Create Express app
const app: Application = express();

// ===== Middleware =====

// Security headers
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Request logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== Health Check =====
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ===== API Routes =====
app.use('/api/v1', routes);

// ===== Root endpoint =====
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'InstaConnect-NG API',
    version: '1.0.0',
    status: 'running',
    documentation: '/api/docs',
  });
});

// ===== 404 Handler =====
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist',
  });
});

// ===== Error Handler =====
app.use(errorHandler);

export default app;
