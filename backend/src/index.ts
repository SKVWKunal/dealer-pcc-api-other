import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createClient } from 'redis';
import session from 'express-session';
import RedisStore from 'connect-redis';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import dealerRoutes from './routes/dealer.routes';
import pccRoutes from './routes/pcc.routes';
import apiRegRoutes from './routes/apiRegistration.routes';
import mtMeetRoutes from './routes/mtMeet.routes';
import surveyRoutes from './routes/survey.routes';
import dashboardRoutes from './routes/dashboard.routes';
import registrationRoutes from './routes/registration.routes';
import rbacRoutes from './routes/rbac.routes';
import dealerRegistrationRoutes from './routes/dealerRegistration.routes';
import { initDatabase } from './config/database';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - required for rate limiter in production/Codespaces
app.set('trust proxy', true);

// Redis client setup
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.connect().catch(console.error);

// Middleware
app.use(helmet());

// CORS configuration with support for Codespaces and local development
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:8082',
  'http://localhost:3000',
  ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
];

// Add Codespaces URLs if in Codespaces environment
if (process.env.CODESPACE_NAME) {
  const codespaceOrigin = `https://${process.env.CODESPACE_NAME}-8082.app.github.dev`;
  allowedOrigins.push(codespaceOrigin);
  logger.info(`Added Codespaces origin: ${codespaceOrigin}`);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      logger.warn(`Blocked CORS request from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || 'your-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      sameSite: 'strict',
    },
  })
);

// Rate limiting with proper trust proxy configuration
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Skip failed requests to prevent lockout on wrong credentials
  skipFailedRequests: false,
  // Use a custom key generator that works with trust proxy
  keyGenerator: (req) => {
    // In Codespaces/production, use X-Forwarded-For, otherwise use req.ip
    return req.headers['x-forwarded-for'] as string || req.ip || 'unknown';
  },
});

app.use('/api/', limiter);

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
  });
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth', registrationRoutes);
app.use('/api/v1/auth', rbacRoutes);
app.use('/api/v1/dealer-registration', dealerRegistrationRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/dealers', dealerRoutes);
app.use('/api/v1/dealer-pcc', pccRoutes);
app.use('/api/v1/api-registration', apiRegRoutes);
app.use('/api/v1/mt-meet', mtMeetRoutes);
app.use('/api/v1/surveys', surveyRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  });
});

// Error handler
app.use(errorHandler);

// Database initialization and server start
const startServer = async () => {
  try {
    await initDatabase();
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
      logger.info(`🔗 API: http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
