"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const supabase_1 = require("./config/supabase");
const logger_1 = require("./utils/logger");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const products_1 = __importDefault(require("./routes/products"));
const categories_1 = __importDefault(require("./routes/categories"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const PORT = Number(process.env.PORT) || 3000;
// Middleware
app.use((0, helmet_1.default)());
// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
// Logging middleware
app.use((0, morgan_1.default)('combined', { stream: logger_1.stream }));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'BaoAfrik Backend API'
    });
});
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/products', products_1.default);
app.use('/api/categories', categories_1.default);
// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'BaoAfrik Backend API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            products: '/api/products',
            categories: '/api/categories',
            health: '/health'
        }
    });
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    logger_1.logger.error('Unhandled error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
// Test Supabase connection function
const testSupabaseConnection = async () => {
    try {
        const { data, error } = await supabase_1.supabase.from('profiles').select('id').limit(1);
        if (error && error.code !== 'PGRST116')
            throw error; // PGRST116 is "table not found" which is expected if schema isn't set up yet
        logger_1.logger.info('✅ Successfully connected to Supabase');
    }
    catch (error) {
        logger_1.logger.error('❌ Failed to connect to Supabase:', error);
    }
};
// Start server
app.listen(PORT, async () => {
    logger_1.logger.info(`🚀 Server is running on port ${PORT}`);
    logger_1.logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    // Test Supabase connection
    await testSupabaseConnection();
    logger_1.logger.info('✅ BaoAfrik Backend API is ready!');
});
