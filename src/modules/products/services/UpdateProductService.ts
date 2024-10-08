import AppError from '@shared/errors/AppError';
import Product from '../infra/typeorm/entities/Product';
import { IProductRepository } from '../domain/repositories/IProductRepository';
import { inject, injectable } from 'tsyringe';
import { IRequestUpdateProduct } from '../domain/models/IRequestUpdateProduct';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

@injectable()
class UpdateProductService {
  constructor(
    @inject('ProductRepository')
    private productsRepository: IProductRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute({
    id,
    name,
    price,
    quantity,
  }: IRequestUpdateProduct): Promise<Product> {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError('There is no product with this id');
    }

    const productExists = await this.productsRepository.findByName(name);

    if (productExists && product.name !== name) {
      throw new AppError('There is already one product with this name');
    }

    product.name = name;
    product.price = price;
    product.quantity = quantity;

    await this.productsRepository.save(product);

    const key = process.env.PRODUCT_CACHE_PREFIX as string;
    await this.redisCache.invalidate(key);

    return product;
  }
}

export default UpdateProductService;
