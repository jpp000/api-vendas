import AppError from '@shared/errors/AppError';
import path from 'path';
import fs from 'fs';
import User from '../infra/typeorm/entities/User';
import uploadConfig from '@config/upload';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { IUpdateAvatar } from '../domain/models/IUpdateAvatar';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IUpdateAvatar): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFilename;

    await this.usersRepository.save(user);

    const key = process.env.USER_CACHE_PREFIX as string;
    await this.redisCache.invalidate(key);

    return user;
  }
}

export default UpdateUserAvatarService;
