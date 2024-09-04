import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import { ProductRepository } from '../typeorm/repositories/ProductsRepository';
import redisCache from '@shared/cache/RedisCache';

interface IPaginateProduct {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  last_page: number | null;
  next_page?: number | null;
  data: Product[];
}

class ListProductService {
  public async execute(): Promise<IPaginateProduct> {
    const productsRepository = getCustomRepository(ProductRepository);

    const key = process.env.PRODUCT_CACHE_PREFIX as string;

    let products = await redisCache.recover<IPaginateProduct>(key);

    if (!products) {
      products = await productsRepository.createQueryBuilder().paginate();
      await redisCache.save(key, products);
    }

    return products as IPaginateProduct;
  }
}

export default ListProductService;
