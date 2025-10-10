"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
require("dotenv/config");
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const loggingMiddleware_1 = require("./middleware/loggingMiddleware");
const logger_1 = __importDefault(require("./config/logger"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const testRoutes_1 = __importDefault(require("./routes/testRoutes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
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
const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "blob:"],
            scriptSrc: ["'self'"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use((0, cors_1.default)(corsOptions));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.set('trust proxy', 1);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
if (process.env.NODE_ENV !== 'test') {
    app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.default.info(message.trim()) } }));
    app.use(loggingMiddleware_1.requestLogger);
}
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'BaoAfrik API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BaoAfrik API Documentation',
}));
app.use('/api/auth', authRoutes_1.default);
app.use('/api/test', testRoutes_1.default);
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const gracefulShutdown = (signal) => {
    logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
    process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        logger_1.default.info('Database connected successfully');
        try {
            const redisClient = await (0, redis_1.connectRedis)();
            if (redisClient) {
                logger_1.default.info('Redis connected successfully');
            }
            else {
                logger_1.default.info('Redis disabled, continuing without caching');
            }
        }
        catch (error) {
            logger_1.default.warn('Redis connection failed, continuing without it:', error);
        }
        const server = app.listen(PORT, () => {
            logger_1.default.info(`🚀 BaoAfrik API server running on port ${PORT}`);
            logger_1.default.info(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
            logger_1.default.info(`🏥 Health check available at http://localhost:${PORT}/health`);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger_1.default.error(`Port ${PORT} is already in use`);
            }
            else {
                logger_1.default.error('Server error:', error);
            }
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
if (process.env.NODE_ENV !== 'test') {
    startServer();
}
exports.default = app;
//# sourceMappingURL=server.js.map