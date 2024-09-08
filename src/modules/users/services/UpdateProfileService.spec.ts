import 'reflect-metadata';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Joao att',
      email: 'testeatt@teste.com',
      password: '654321',
      old_password: '123456',
    });

    expect(updatedUser.name).toBe('Joao att');
    expect(updatedUser.email).toBe('testeatt@teste.com');
  });

  it('should not be able to update the profile if user does not exist', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com',
        password: '654321',
        old_password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change to an email already used by another user', async () => {
    await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Pedro',
      email: 'teste1@teste.com',
      password: '123456',
    });

    expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Pedro',
        email: 'teste@teste.com',
        old_password: '123456',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Joao',
        email: 'teste@teste.com',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Joao',
        email: 'teste@teste.com',
        password: '123456',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
