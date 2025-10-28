import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import 'dotenv/config';

import { createServer } from 'http';
import { WebSocketService } from './socket/webSocketService';
import { Server } from 'socket.io';

import { errorHandler, notFound } from '@/middleware/errorMiddleware';
import { requestLogger } from '@/middleware/loggingMiddleware';
import logger from '@/config/logger';
import { connectDatabase } from '@/config/database';
import { connectRedis } from '@/config/redis';

import authRoutes from '@/routes/authRoutes';
import testRoutes from '@/routes/testRoutes';
import chatRoutes from '@/routes/chatRoutes';
import s3Routes from '@/routes/s3Routes';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:3001'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
});

new WebSocketService(io);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BaoAfrik API',
      version: '1.0.0',
      description: 'API for BaoAfrik - African Marketplace Platform',
      contact: {
        name: 'BaoAfrik Team',
        email: 'api@baoafrik.com',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? 'https://api.baoafrik.com'
          : `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts', './src/models/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:", "http://localhost:3001"]
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
app.set('trust proxy', 1);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
  app.use(requestLogger);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BaoAfrik API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'BaoAfrik API Documentation',
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/upload', s3Routes);

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown handler
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Connect to Redis (optional)
    try {
      const redisClient = await connectRedis();
      if (redisClient) {
        logger.info('Redis connected successfully');
      } else {
        logger.info('Redis disabled, continuing without caching');
      }
    } catch (error) {
      logger.warn('Redis connection failed, continuing without it:', error);
    }

    // Start HTTP server
    server.listen(PORT, () => {
      logger.info(`BaoAfrik API server running on port ${PORT}`);
      logger.info(`API Documentation available at http://localhost:${PORT}/api-docs`);
      logger.info(`Health check available at http://localhost:${PORT}/health`);
      logger.info(`WebSocket server running on port ${PORT}`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use`);
      } else {
        logger.error('Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, server, io, WebSocketService };
