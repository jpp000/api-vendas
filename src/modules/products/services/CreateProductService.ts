import AppError from '@shared/errors/AppError';
import Product from '../infra/typeorm/entities/Product';
import { inject, injectable } from 'tsyringe';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('ProductRepository')
    private productsRepository: IProductRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productExists = await this.productsRepository.findByName(name);

    if (productExists) {
      throw new AppError('There is already one product with this name');
    }

    const product = await this.productsRepository.create({
      name,
      price,
      quantity,
    });

    await this.productsRepository.save(product);

    const key = process.env.PRODUCT_CACHE_PREFIX as string;
    this.redisCache.invalidate(key);

    return product;
  }
}

export default CreateProductService;
