import { getCustomRepository } from 'typeorm';
import { ProductRepository } from '../infra/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import Product from '../infra/typeorm/entities/Product';
import redisCache from '@shared/cache/RedisCache';

interface IRequest {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

class UpdateProductService {
  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequest): Promise<Product> {
    const productsRepository = getCustomRepository(ProductRepository);
    const product = await productsRepository.findOne(id);

    if (!product) {
      throw new AppError('There is no product with this id');
    }

    const productExists = await productsRepository.findByName(name);

    if (productExists && product.name !== name) {
      throw new AppError('There is already one product with this name');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await productsRepository.save(product);

    const key = process.env.PRODUCT_CACHE_PREFIX as string;
    redisCache.invalidate(key);

    return product;
  }
}

export default UpdateProductService;
