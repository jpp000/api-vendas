import User from '../infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { hash } from 'bcryptjs';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import { ICreateUser } from '../domain/models/ICreateUser';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute({ name, email, password }: ICreateUser): Promise<User> {
    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already exists.');
    }

    const hashedPassword = await hash(password, 8);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const key = process.env.USER_CACHE_PREFIX as string;
    await this.redisCache.invalidate(key);

    return user;
  }
}

export default CreateUserService;
