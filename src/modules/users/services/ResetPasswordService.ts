import { isAfter, addHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUserTokensRepository } from '../domain/repositories/IUserTokensRepository';
import { inject, injectable } from 'tsyringe';
import { IResetPassword } from '../domain/models/IResetPassword';

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute({ token, password }: IResetPassword) {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists');
    }

    const { user_id } = userToken;
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { created_at } = userToken;
    const compareDate = addHours(created_at, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await hash(password, 8);

    await this.usersRepository.save(user);

    await this.userTokensRepository.clear();
  }
}

export default ResetPasswordService;
