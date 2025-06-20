import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

/**
 * Wrapper for Redis operations with JSON serialization.
 * Handles caching with optional TTL (Time-To-Live) support.
 */
@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  /**
   * Gets a value from Redis and parses it as JSON.
   * @returns `null` if the key doesn't exist.
   */
  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) as T : null;
  }

  /**
   * Sets a value in Redis with optional expiration.
   * @param ttl - Time-To-Live in seconds (optional).
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const stringValue = JSON.stringify(value);
    await (ttl 
      ? this.redisClient.set(key, stringValue, 'EX', ttl) 
      : this.redisClient.set(key, stringValue)
    );
  }

  /** Deletes a key from Redis. */
  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}