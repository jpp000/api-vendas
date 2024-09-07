import redisCache from '@shared/cache/RedisCache';
import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    await this.usersRepository.remove(user);

    const key = process.env.USER_CACHE_PREFIX as string;
    await redisCache.invalidate(key);
    return user;
  }
}

export default DeleteUserService;
