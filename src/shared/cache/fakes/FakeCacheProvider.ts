import { ICacheProvider } from '../models/ICacheProvider';

class FakeCacheProvider implements ICacheProvider {
  private cache: { [key: string]: any } = {};

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = value;
  }

  public async recover<T>(key: string): Promise<T | null> {
    return this.cache[key] ?? null;
  }

  public async invalidate(key: string): Promise<void> {
    delete this.cache[key];
  }
}

export default FakeCacheProvider;
