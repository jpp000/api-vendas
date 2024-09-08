import 'reflect-metadata';
import CreateCustomersService from './CreateCustomerService';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeCacheProvider: FakeCacheProvider;
let createCustomer: CreateCustomersService;

describe('CreateCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createCustomer = new CreateCustomersService(
      fakeCustomersRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new customer', async () => {
    const customer = await createCustomer.execute({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    expect(customer).toHaveProperty('id');
    expect(customer.name).toBe('Joao');
    expect(customer.email).toBe('teste@teste.com');
  });

  it('should invalidate cache when a customer is created', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');

    await createCustomer.execute({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    expect(invalidateSpy).toHaveBeenCalledWith(
      process.env.CUSTOMER_CACHE_PREFIX as string,
    );
  });

  it('should not be able to create two customers with the same email', async () => {
    await createCustomer.execute({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    expect(
      createCustomer.execute({
        name: 'Joao',
        email: 'teste@teste.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
