import Product from '../infra/typeorm/entities/Product';
import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductRepository';

export interface IPaginateProduct {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  last_page: number | null;
  next_page?: number | null;
  data: Product[];
}

@injectable()
class ListProductService {
  constructor(
    @inject('ProductRepository')
    private productsRepository: IProductRepository,
  ) {}

  public async execute(): Promise<IPaginateProduct> {
    const key = process.env.PRODUCT_CACHE_PREFIX as string;

    let products = await redisCache.recover<IPaginateProduct>(key);

    if (!products) {
      products = await this.productsRepository.listAll();
      await redisCache.save(key, products);
    }

    return products as IPaginateProduct;
  }
}

export default ListProductService;
