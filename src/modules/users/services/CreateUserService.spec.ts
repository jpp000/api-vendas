import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

let fakeCacheProvider: FakeCacheProvider;
let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;

let createUser: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    createUser = new CreateUserService(
      fakeUsersRepository,
      fakeCacheProvider,
      fakeHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Joao');
    expect(user.email).toBe('teste@teste.com');
    expect(user.password).toBe('123456');
  });

  it('should not be able to create two users with the same email', async () => {
    await createUser.execute({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(
      createUser.execute({
        name: 'Joao',
        email: 'teste@teste.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should invalidate cache when a user is created', async () => {
    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidate');

    await createUser.execute({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    expect(invalidateSpy).toHaveBeenCalledWith(
      process.env.USER_CACHE_PREFIX as string,
    );
  });
});
