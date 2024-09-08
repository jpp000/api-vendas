import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import DeleteUserService from './DeleteUserService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;

let deleteUser: DeleteUserService;

describe('DeleteUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    deleteUser = new DeleteUserService(fakeUsersRepository, fakeCacheProvider);
  });

  it('should remove a user from the list', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    await deleteUser.execute(user.id);

    const userFound = await fakeUsersRepository.findById(user.id);

    expect(userFound).toBeUndefined();
  });

  it('should invalidate cache when a user is removed', async () => {
    expect(deleteUser.execute('non-existing-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
