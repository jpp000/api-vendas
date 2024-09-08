import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it('should show user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    const userFound = await showProfile.execute(user.id);

    expect(userFound.name).toBe('Joao');
    expect(userFound.email).toBe('teste@teste.com');
    expect(userFound.password).toBe('123456');
  });

  it('should not show user if user do not exists', async () => {
    expect(showProfile.execute('non-existing-id')).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
