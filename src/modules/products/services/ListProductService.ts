import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';
import { IPaginateProduct } from '@modules/products/domain/models/IPaginateProduct';

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
