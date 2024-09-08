import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    await this.usersRepository.remove(user);

    const key = process.env.USER_CACHE_PREFIX as string;
    await this.redisCache.invalidate(key);
    return user;
  }
}

export default DeleteUserService;
