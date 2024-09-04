import redisCache from '@shared/cache/RedisCache';
import User from '../typeorm/entities/User';
import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

class DeleteUserService {
  public async execute({ id }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await usersRepository.findById(id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    await usersRepository.remove(user);

    const key = process.env.USER_CACHE_PREFIX as string;
    await redisCache.invalidate(key);

    return user;
  }
}

export default DeleteUserService;
