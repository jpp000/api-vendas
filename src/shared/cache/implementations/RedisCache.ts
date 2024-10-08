import cacheConfig from '@config/cache';
import Redis from 'ioredis';
import { ICacheProvider } from './models/ICacheProvider';

class RedisCache implements ICacheProvider {
  private client: Redis;
  private connected = false;

  constructor() {
    if (!this.connected) {
      this.client = new Redis(cacheConfig.config.redis);
      this.connected = true;
    }
  }

  public async save(key: string, value: unknown): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    if (!data) return null;

    return JSON.parse(data) as T;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }
}

export default RedisCache;
