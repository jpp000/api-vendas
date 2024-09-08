import { container } from 'tsyringe';
import { ICacheProvider } from './models/ICacheProvider';
import RedisCache from './implementations/RedisCache';

container.registerSingleton<ICacheProvider>('CacheProvider', RedisCache);
