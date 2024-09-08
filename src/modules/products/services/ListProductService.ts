import Product from '../infra/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

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

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute(): Promise<IPaginateProduct> {
    const key = process.env.PRODUCT_CACHE_PREFIX as string;

    let products = await this.redisCache.recover<IPaginateProduct>(key);

    if (!products) {
      products = await this.productsRepository.listAll();
      await this.redisCache.save(key, products);
    }

    return products as IPaginateProduct;
  }
}

export default ListProductService;
