import { getCustomRepository } from 'typeorm';
import { isAfter, addHours } from 'date-fns';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import UserTokensRepository from '../infra/typeorm/repositories/UserTokensRepository';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IRequest {
  token: string;
  password: string;
}

class ResetPasswordService {
  public async execute({ token, password }: IRequest) {
    const usersRepository = getCustomRepository(UsersRepository);
    const userTokensRepository = getCustomRepository(UserTokensRepository);

    const userToken = await userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User Token does not exists');
    }

    const { user_id } = userToken;
    const user = await usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const { created_at } = userToken;
    const compareDate = addHours(created_at, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired');
    }

    user.password = await hash(password, 8);

    await usersRepository.save(user);

    await userTokensRepository.clear();
  }
}

export default ResetPasswordService;
