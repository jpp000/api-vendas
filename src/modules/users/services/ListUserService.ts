import { getCustomRepository } from 'typeorm';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import User from '../infra/typeorm/entities/User';
import redisCache from '@shared/cache/RedisCache';

interface IPaginateUser {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  last_page: number | null;
  next_page?: number | null;
  data: User[];
}

class ListUserService {
  public async execute(): Promise<IPaginateUser> {
    const usersRepository = getCustomRepository(UsersRepository);

    const key = process.env.USER_CACHE_PREFIX as string;

    let users = await redisCache.recover<IPaginateUser>(key);

    if (!users) {
      users = await usersRepository.createQueryBuilder().paginate();
      await redisCache.save(key, users);
    }

    return users as IPaginateUser;
  }
}

export default ListUserService;
