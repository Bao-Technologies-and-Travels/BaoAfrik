"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flushCache = exports.deleteCache = exports.getCache = exports.setCache = exports.isRedisConnected = exports.disconnectRedis = exports.isRedisEnabled = exports.getRedisClient = exports.connectRedis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("./logger"));
let redis = null;
let redisEnabled = true;
const connectRedis = async () => {
    if (!process.env.REDIS_URL && process.env.NODE_ENV !== 'production') {
        logger_1.default.warn('REDIS_URL not set, Redis will be disabled in development mode');
        redisEnabled = false;
        return null;
    }
    try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        redis = new ioredis_1.default(redisUrl, {
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            lazyConnect: true,
            retryStrategy: (times) => {
                if (times > 3) {
                    logger_1.default.warn('Max Redis connection attempts reached, disabling Redis');
                    redisEnabled = false;
                    return null;
                }
                return Math.min(times * 100, 3000);
            }
        });
        redis.on('connect', () => {
            logger_1.default.info('Successfully connected to Redis');
            redisEnabled = true;
        });
        redis.on('error', (error) => {
            logger_1.default.error('Redis connection error:', error);
            redisEnabled = false;
        });
        redis.on('ready', () => {
            logger_1.default.info('Redis is ready to accept commands');
            redisEnabled = true;
        });
        redis.on('close', () => {
            logger_1.default.warn('Redis connection closed');
            redisEnabled = false;
        });
        redis.on('reconnecting', () => {
            logger_1.default.info('Reconnecting to Redis...');
        });
        await redis.connect().catch(error => {
            logger_1.default.warn('Failed to connect to Redis, continuing without it', error);
            redisEnabled = false;
            return null;
        });
        return redis;
    }
    catch (error) {
        logger_1.default.warn('Redis connection failed, continuing without it:', error);
        redisEnabled = false;
        return null;
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    if (!redis || !redisEnabled) {
        return null;
    }
    return redis;
};
exports.getRedisClient = getRedisClient;
const isRedisEnabled = () => {
    return redisEnabled && redis !== null;
};
exports.isRedisEnabled = isRedisEnabled;
const disconnectRedis = async () => {
    if (redis) {
        try {
            await redis.quit();
            redis = null;
            logger_1.default.info('Disconnected from Redis');
        }
        catch (error) {
            logger_1.default.error('Error disconnecting from Redis:', error);
            throw error;
        }
    }
};
exports.disconnectRedis = disconnectRedis;
const isRedisConnected = () => {
    return redis !== null && redis.status === 'ready';
};
exports.isRedisConnected = isRedisConnected;
const setCache = async (key, value, ttl = 3600) => {
    try {
        const client = (0, exports.getRedisClient)();
        if (!client) {
            logger_1.default.warn('Redis not available, skipping cache set');
            return;
        }
        await client.setex(key, ttl, JSON.stringify(value));
    }
    catch (error) {
        logger_1.default.error('Failed to set cache:', error);
        throw error;
    }
};
exports.setCache = setCache;
const getCache = async (key) => {
    try {
        const client = (0, exports.getRedisClient)();
        if (!client) {
            logger_1.default.warn('Redis not available, returning null for cache get');
            return null;
        }
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    }
    catch (error) {
        logger_1.default.error('Failed to get cache:', error);
        return null;
    }
};
exports.getCache = getCache;
const deleteCache = async (key) => {
    try {
        const client = (0, exports.getRedisClient)();
        if (!client) {
            logger_1.default.warn('Redis not available, skipping cache delete');
            return;
        }
        await client.del(key);
    }
    catch (error) {
        logger_1.default.error('Failed to delete cache:', error);
        throw error;
    }
};
exports.deleteCache = deleteCache;
const flushCache = async () => {
    try {
        const client = (0, exports.getRedisClient)();
        if (!client) {
            logger_1.default.warn('Redis not available, skipping cache flush');
            return;
        }
        await client.flushall();
        logger_1.default.info('Cache flushed successfully');
    }
    catch (error) {
        logger_1.default.error('Failed to flush cache:', error);
        throw error;
    }
};
exports.flushCache = flushCache;
exports.default = redis;
//# sourceMappingURL=redis.js.map