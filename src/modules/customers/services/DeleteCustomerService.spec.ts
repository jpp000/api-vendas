import 'reflect-metadata';
import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import DeleteCustomerService from './DeleteCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import AppError from '@shared/errors/AppError';

let fakeCacheProvider: FakeCacheProvider;
let fakeCustomersRepository: FakeCustomersRepository;
let deleteCustomer: DeleteCustomerService;

describe('DeleteCustomer', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeCustomersRepository = new FakeCustomersRepository();

    deleteCustomer = new DeleteCustomerService(
      fakeCustomersRepository,
      fakeCacheProvider,
    );
  });

  it('should remove a customer from list', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    await deleteCustomer.execute(customer.id);

    const findCustomer = await fakeCustomersRepository.findById(customer.id);

    expect(findCustomer).toBeUndefined();
  });

  it('should invalidate cache when a customer is removed', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');
    const customer = await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    await deleteCustomer.execute(customer.id);

    expect(invalidateSpy).toHaveBeenCalledWith(
      process.env.CUSTOMER_CACHE_PREFIX as string,
    );
  });

  it('should throw an error if customer does not exist', async () => {
    await expect(
      deleteCustomer.execute('non-existing-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
