import AppError from '@shared/errors/AppError';
import FakeProductRepository from '../domain/repositories/fakes/FakeProductRepository';
import ShowProductService from './ShowProductService';

let fakeProductRepository: FakeProductRepository;
let showProduct: ShowProductService;

describe('ShowProduct', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();

    showProduct = new ShowProductService(fakeProductRepository);
  });

  it('should show a product', async () => {
    const product = await fakeProductRepository.create({
      name: 'Product',
      quantity: 1,
      price: 10,
    });

    const response = await showProduct.execute(product.id);

    expect(response).toEqual(product);
  });

  it('should not return a inexistent product', async () => {
    expect(showProduct.execute('non-existent-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
