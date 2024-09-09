import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeProductRepository from '../domain/repositories/fakes/FakeProductRepository';
import UpdateProductService from './UpdateProductService';
import AppError from '@shared/errors/AppError';

let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateProduct: UpdateProductService;

describe('UpdateProduct', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateProduct = new UpdateProductService(
      fakeProductRepository,
      fakeCacheProvider,
    );
  });

  it('should update product', async () => {
    const product = await fakeProductRepository.create({
      name: 'Product',
      quantity: 1,
      price: 10,
    });

    await updateProduct.execute({
      id: product.id,
      name: 'Product att',
      quantity: 10,
      price: 10,
    });

    expect(product.name).toBe('Product att');
    expect(product.quantity).toBe(10);
    expect(product.price).toBe(10);
  });

  it('should not update an inexistent product', async () => {
    await expect(
      updateProduct.execute({
        id: 'non-existing-id',
        name: 'Product',
        price: 1,
        quantity: 1,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to a name already used by another product', async () => {
    await fakeProductRepository.create({
      name: 'Product',
      quantity: 1,
      price: 10,
    });

    const product = await fakeProductRepository.create({
      name: 'Product1',
      quantity: 1,
      price: 10,
    });

    await expect(
      updateProduct.execute({
        id: product.id,
        name: 'Product',
        quantity: 10,
        price: 10,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should invalidate cache when a product is updated', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');

    const product = await fakeProductRepository.create({
      name: 'Product',
      quantity: 1,
      price: 10,
    });

    await updateProduct.execute({
      id: product.id,
      name: 'Product att',
      quantity: 10,
      price: 10,
    });

    expect(invalidateSpy).toHaveBeenCalledWith(
      process.env.PRODUCT_CACHE_PREFIX as string,
    );
  });
});
