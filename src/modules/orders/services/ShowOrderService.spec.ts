import AppError from '@shared/errors/AppError';
import FakeOrdersRepository from '../domain/repositories/fakes/FakeOrdersRepository';
import ShowOrderService from './ShowOrderService';

let fakeOrdersRepository: FakeOrdersRepository;
let showOrder: ShowOrderService;

describe('ShowOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();

    showOrder = new ShowOrderService(fakeOrdersRepository);
  });

  it('should show order', async () => {
    const customer = {
      id: 'fake-customer-id',
      name: 'Fake Customer',
      email: 'fake@customer.com',
      created_at: new Date(),
      updated_at: new Date(),
    };

    const products = [
      {
        product_id: 'fake-product-id-1',
        price: 100,
        quantity: 2,
      },
      {
        product_id: 'fake-product-id-2',
        price: 200,
        quantity: 1,
      },
    ];

    const createdOrder = await fakeOrdersRepository.create({
      customer,
      products,
    });

    const response = await showOrder.execute(createdOrder.id);

    expect(response).toBe(createdOrder);
  });

  it('should not show an inexistent order', async () => {
    expect(showOrder.execute('non-existing-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
