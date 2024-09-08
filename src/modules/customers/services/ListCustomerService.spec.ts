import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import ListCustomerService from './ListCustomerService';
import { IPaginateCustomer } from '../domain/models/IPaginateCustomer';
import Customer from '../infra/typeorm/entities/Customer';

let fakeCustomersRepository: FakeCustomersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listCustomer: ListCustomerService;

describe('ListCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listCustomer = new ListCustomerService(
      fakeCustomersRepository,
      fakeCacheProvider,
    );
  });

  it('should list all customers from repository if cache is empty', async () => {
    await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    await fakeCustomersRepository.create({
      name: 'Pedro',
      email: 'teste@teste.com',
    });

    const customers = await listCustomer.execute();

    const list: IPaginateCustomer = {
      from: 1,
      to: 10,
      per_page: 10,
      total: 2,
      current_page: 1,
      last_page: 1,
      data: customers as unknown as Customer[],
    };

    expect(list.data.length).toBe(2);
    expect(list.data[0].name).toBe('Joao');
    expect(list.data[1].name).toBe('Pedro');
  });

  it('should verify if cache provider functions are being called', async () => {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    const recoverSpy = jest.spyOn(fakeCacheProvider, 'recover');
    const saveSpy = jest.spyOn(fakeCacheProvider, 'save');

    await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'joao@teste.com',
    });

    await fakeCustomersRepository.create({
      name: 'Pedro',
      email: 'pedro@teste.com',
    });

    await listCustomer.execute();

    expect(recoverSpy).toHaveBeenCalledWith(key);

    const customers = await fakeCustomersRepository.listAll();
    expect(saveSpy).toHaveBeenCalledWith(key, customers);
  });

  it('should use cache if data is already present', async () => {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'joao@teste.com',
    });

    await fakeCustomersRepository.create({
      name: 'Pedro',
      email: 'pedro@teste.com',
    });

    const customers = await fakeCustomersRepository.listAll();
    await fakeCacheProvider.save(key, customers);

    const recoverSpy = jest.spyOn(fakeCacheProvider, 'recover');
    const saveSpy = jest.spyOn(fakeCacheProvider, 'save');

    const cachedCustomers = await listCustomer.execute();

    const list: IPaginateCustomer = {
      from: 1,
      to: 10,
      per_page: 10,
      total: 2,
      current_page: 1,
      last_page: 1,
      data: cachedCustomers as unknown as Customer[],
    };

    expect(recoverSpy).toHaveBeenCalledWith(key);
    expect(saveSpy).not.toHaveBeenCalled();

    expect(list.data.length).toBe(2);
    expect(list.data[0].name).toBe('Joao');
    expect(list.data[1].name).toBe('Pedro');
  });
});
