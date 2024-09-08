import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeProductRepository from '../domain/repositories/fakes/FakeProductRepository';
import DeleteProductService from './DeleteProductService';
import AppError from '@shared/errors/AppError';

let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteProduct: DeleteProductService;

describe('DeleteProduct', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();

    deleteProduct = new DeleteProductService(
      fakeProductRepository,
      fakeCacheProvider,
    );
  });

  it('should remove a product', async () => {
    const product = await fakeProductRepository.create({
      name: 'Product',
      price: 10,
      quantity: 1,
    });

    await deleteProduct.execute(product.id);

    const productFound = await fakeProductRepository.findById(product.id);

    expect(productFound).toBeUndefined();
  });

  it('should not remove a inexistent product', async () => {
    expect(deleteProduct.execute('non-existing-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });

  it('should invalidade cache key when product is deleted', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');

    const product = await fakeProductRepository.create({
      name: 'Product',
      price: 10,
      quantity: 1,
    });

    await deleteProduct.execute(product.id);

    expect(invalidateSpy).toHaveBeenCalledWith(
      process.env.PRODUCT_CACHE_PREFIX as string,
    );
  });
});
