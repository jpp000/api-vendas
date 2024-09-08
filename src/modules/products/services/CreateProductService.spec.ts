import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeProductRepository from '../domain/repositories/fakes/FakeProductRepository';
import CreateProductService from './CreateProductService';
import AppError from '@shared/errors/AppError';

let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;
let createProduct: CreateProductService;

describe('CreateProduct', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createProduct = new CreateProductService(
      fakeProductRepository,
      fakeCacheProvider,
    );
  });

  it('should create a product', async () => {
    const product = await createProduct.execute({
      name: 'Product',
      price: 10,
      quantity: 1,
    });

    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Product');
    expect(product.price).toBe(10);
    expect(product.quantity).toBe(1);
  });

  it('should invalidate cache key', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');

    await createProduct.execute({
      name: 'Product',
      price: 10,
      quantity: 1,
    });

    expect(invalidateSpy).toHaveBeenCalledWith(
      process.env.PRODUCT_CACHE_PREFIX as string,
    );
  });

  it('should not create a product with the same name', async () => {
    await createProduct.execute({
      name: 'Product',
      price: 10,
      quantity: 1,
    });

    await expect(
      createProduct.execute({
        name: 'Product',
        price: 20,
        quantity: 2,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
