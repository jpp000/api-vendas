import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

@injectable()
class DeleteProductService {
  constructor(
    @inject('ProductRepository')
    private productsRepository: IProductRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute(id: string): Promise<void> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    await this.productsRepository.remove(product);

    const key = process.env.PRODUCT_CACHE_PREFIX as string;
    await this.redisCache.invalidate(key);
  }
}

export default DeleteProductService;
