import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../domain/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from './ResetPasswordService';
import { addHours } from 'date-fns';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;

let resetPassword: ResetPasswordService;

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHashSpy = jest.spyOn(fakeHashProvider, 'generateHash');
    const clearTokensSpy = jest.spyOn(fakeUserTokensRepository, 'clear');

    await resetPassword.execute({
      token,
      password: '654321',
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHashSpy).toHaveBeenCalledWith('654321');
    expect(updatedUser?.password).toBe('654321');
    expect(clearTokensSpy).toHaveBeenCalled();
  });

  it('should not be able to reset the password with a non-existing token', async () => {
    expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if user does not exist', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing-user-id',
    );

    await expect(
      resetPassword.execute({
        token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if token is expired', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    const userToken = await fakeUserTokensRepository.generate(user.id);

    userToken.created_at = addHours(new Date(), -3);

    await expect(
      resetPassword.execute({
        token: userToken.token,
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
