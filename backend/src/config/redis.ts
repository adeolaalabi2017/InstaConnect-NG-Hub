import Redis from 'ioredis';
import { logger } from '../utils/logger';

let redis: Redis | null = null;

/**
 * Connect to Redis
 */
export async function connectRedis(): Promise<Redis> {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on('connect', () => {
      logger.info('✅ Redis connection established');
    });

    redis.on('error', (error) => {
      logger.error('❌ Redis connection error:', error);
    });

    return redis;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
}

/**
 * Disconnect from Redis
 */
export async function disconnectRedis(): Promise<void> {
  if (redis) {
    await redis.quit();
    logger.info('Redis disconnected');
  }
}

/**
 * Get Redis client
 */
export function getRedisClient(): Redis | null {
  return redis;
}

/**
 * Check Redis health
 */
export async function checkRedisHealth(): Promise<boolean> {
  try {
    if (!redis) return false;
    const response = await redis.ping();
    return response === 'PONG';
  } catch {
    return false;
  }
}
