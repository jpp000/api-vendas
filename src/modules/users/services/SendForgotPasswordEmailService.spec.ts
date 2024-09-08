import 'reflect-metadata';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import EtherealMail from '@config/mail/EtherealMail';
import FakeUsersRepository from '../domain/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../domain/repositories/fakes/FakeUserTokensRepository';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeUserTokensRepository,
    );

    jest
      .spyOn(EtherealMail, 'sendMail')
      .mockImplementation(() => Promise.resolve());
  });

  it('should be able to send a forgot password email', async () => {
    const sendMail = jest.spyOn(EtherealMail, 'sendMail');

    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute(user.email);

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send email if user does not exist', async () => {
    await expect(
      sendForgotPasswordEmail.execute('nonexistent@teste.com'),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a user token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute(user.email);

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
