import Redis from 'ioredis';
import logger from './logger';

let redis: Redis | null = null;
let redisEnabled = true;

export const connectRedis = async (): Promise<Redis | null> => {
  if (!process.env.REDIS_URL && process.env.NODE_ENV !== 'production') {
    logger.warn('REDIS_URL not set, Redis will be disabled in development mode');
    redisEnabled = false;
    return null;
  }

  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    redis = new Redis(redisUrl, {
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
      lazyConnect: true,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.warn('Max Redis connection attempts reached, disabling Redis');
          redisEnabled = false;
          return null; // Stop retrying
        }
        return Math.min(times * 100, 3000); // Retry with backoff
      }
    });

    redis.on('connect', () => {
      logger.info('Successfully connected to Redis');
      redisEnabled = true;
    });

    redis.on('error', (error) => {
      logger.error('Redis connection error:', error);
      redisEnabled = false;
    });

    redis.on('ready', () => {
      logger.info('Redis is ready to accept commands');
      redisEnabled = true;
    });

    redis.on('close', () => {
      logger.warn('Redis connection closed');
      redisEnabled = false;
    });

    redis.on('reconnecting', () => {
      logger.info('Reconnecting to Redis...');
    });

    await redis.connect().catch(error => {
      logger.warn('Failed to connect to Redis, continuing without it', error);
      redisEnabled = false;
      return null;
    });
    
    return redis;
  } catch (error) {
    logger.warn('Redis connection failed, continuing without it:', error);
    redisEnabled = false;
    return null;
  }
};

export const getRedisClient = (): Redis | null => {
  if (!redis || !redisEnabled) {
    return null;
  }
  return redis;
};

export const isRedisEnabled = (): boolean => {
  return redisEnabled && redis !== null;
};

export const disconnectRedis = async (): Promise<void> => {
  if (redis) {
    try {
      await redis.quit();
      redis = null;
      logger.info('Disconnected from Redis');
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
      throw error;
    }
  }
};

// Health check function
export const isRedisConnected = (): boolean => {
  return redis !== null && redis.status === 'ready';
};

// Cache utilities
export const setCache = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
  try {
    const client = getRedisClient();
    if (!client) {
      logger.warn('Redis not available, skipping cache set');
      return;
    }
    await client.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error('Failed to set cache:', error);
    throw error;
  }
};

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    if (!client) {
      logger.warn('Redis not available, returning null for cache get');
      return null;
    }
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Failed to get cache:', error);
    return null;
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    if (!client) {
      logger.warn('Redis not available, skipping cache delete');
      return;
    }
    await client.del(key);
  } catch (error) {
    logger.error('Failed to delete cache:', error);
    throw error;
  }
};

export const flushCache = async (): Promise<void> => {
  try {
    const client = getRedisClient();
    if (!client) {
      logger.warn('Redis not available, skipping cache flush');
      return;
    }
    await client.flushall();
    logger.info('Cache flushed successfully');
  } catch (error) {
    logger.error('Failed to flush cache:', error);
    throw error;
  }
};

export default redis;
