import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
}

class DeleteProductService {
  public async execute({ id }: IRequest): Promise<void> {
    const productsRepository = getCustomRepository(ProductRepository);
    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    await productsRepository.remove(product);

    const key = process.env.PRODUCT_CACHE_PREFIX as string;
    redisCache.invalidate(key);
  }
}

export default DeleteProductService;
