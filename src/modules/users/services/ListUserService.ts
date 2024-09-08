import { ICacheProvider } from '@shared/cache/models/ICacheProvider';
import { IPaginateUser } from '../domain/models/IPaginateUser';
import { IUsersRepository } from '../domain/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute(): Promise<IPaginateUser> {
    const key = process.env.USER_CACHE_PREFIX as string;

    let users = await this.redisCache.recover<IPaginateUser>(key);

    if (!users) {
      users = await this.usersRepository.findAll();
      await this.redisCache.save(key, users);
    }

    return users as IPaginateUser;
  }
}

export default ListUserService;
