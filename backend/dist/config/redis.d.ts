import Redis from 'ioredis';
declare let redis: Redis | null;
export declare const connectRedis: () => Promise<Redis | null>;
export declare const getRedisClient: () => Redis | null;
export declare const isRedisEnabled: () => boolean;
export declare const disconnectRedis: () => Promise<void>;
export declare const isRedisConnected: () => boolean;
export declare const setCache: (key: string, value: any, ttl?: number) => Promise<void>;
export declare const getCache: <T>(key: string) => Promise<T | null>;
export declare const deleteCache: (key: string) => Promise<void>;
export declare const flushCache: () => Promise<void>;
export default redis;
//# sourceMappingURL=redis.d.ts.map