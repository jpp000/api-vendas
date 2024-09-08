import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import ListUserService from './ListUserService';
import { IPaginateUser } from '../domain/models/IPaginateUser';
import User from '../infra/typeorm/entities/User';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listUser: ListUserService;

describe('listUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listUser = new ListUserService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should list all users from repository if cache is empty', async () => {
    await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Pedro',
      email: 'teste@teste.com',
      password: '123456',
    });

    const customers = await listUser.execute();

    const list: IPaginateUser = {
      from: 1,
      to: 10,
      per_page: 10,
      total: 2,
      current_page: 1,
      last_page: 1,
      data: customers as unknown as User[],
    };

    expect(list.data.length).toBe(2);
    expect(list.data[0].name).toBe('Joao');
    expect(list.data[1].name).toBe('Pedro');
  });

  it('should verify if cache provider functions are being called', async () => {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    const recoverSpy = jest.spyOn(fakeCacheProvider, 'recover');
    const saveSpy = jest.spyOn(fakeCacheProvider, 'save');

    await fakeUsersRepository.create({
      name: 'Joao',
      email: 'joao@teste.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Pedro',
      email: 'pedro@teste.com',
      password: '123456',
    });

    await listUser.execute();

    expect(recoverSpy).toHaveBeenCalledWith(key);

    const customers = await fakeUsersRepository.listAll();
    expect(saveSpy).toHaveBeenCalledWith(key, customers);
  });

  it('should use cache if data is already present', async () => {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    await fakeUsersRepository.create({
      name: 'Joao',
      email: 'joao@teste.com',
      password: '123456',
    });

    await fakeUsersRepository.create({
      name: 'Pedro',
      email: 'pedro@teste.com',
      password: '123456',
    });

    const customers = await fakeUsersRepository.listAll();
    await fakeCacheProvider.save(key, customers);

    const recoverSpy = jest.spyOn(fakeCacheProvider, 'recover');
    const saveSpy = jest.spyOn(fakeCacheProvider, 'save');

    const cachedCustomers = await listUser.execute();

    const list: IPaginateUser = {
      from: 1,
      to: 10,
      per_page: 10,
      total: 2,
      current_page: 1,
      last_page: 1,
      data: cachedCustomers as unknown as User[],
    };

    expect(recoverSpy).toHaveBeenCalledWith(key);
    expect(saveSpy).not.toHaveBeenCalled();

    expect(list.data.length).toBe(2);
    expect(list.data[0].name).toBe('Joao');
    expect(list.data[1].name).toBe('Pedro');
  });
});
