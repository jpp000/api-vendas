import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import UpdateCustomerService from './UpdateCustomerService';
import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeCacheProvider: FakeCacheProvider;
let updateCustomer: UpdateCustomerService;

describe('UpdateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    updateCustomer = new UpdateCustomerService(
      fakeCustomersRepository,
      fakeCacheProvider,
    );
  });

  it('should update user credentials', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    const updatedCustomer = await updateCustomer.execute({
      id: customer.id,
      name: 'Pedro',
      email: customer.email,
    });

    expect(updatedCustomer.name).toBe('Pedro');
    expect(updatedCustomer.email).toBe('teste@teste.com');
  });

  it('should throw an error if customer does not exist', async () => {
    await expect(
      updateCustomer.execute({
        id: 'non-existing-id',
        name: 'Joao',
        email: 'teste@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should throw an error if customer email is already registered', async () => {
    await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    const customer2 = await fakeCustomersRepository.create({
      name: 'Pedro',
      email: 'teste1@teste.com',
    });

    await expect(
      updateCustomer.execute({
        id: customer2.id,
        name: 'Pedro',
        email: 'teste@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should invalidate cache when a customer is updated', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');

    const customer = await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    await updateCustomer.execute({
      id: customer.id,
      name: 'Pedro',
      email: customer.email,
    });

    expect(invalidateSpy).toHaveBeenCalledWith(
      process.env.CUSTOMER_CACHE_PREFIX as string,
    );
  });
});
