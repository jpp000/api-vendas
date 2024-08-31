import { getCustomRepository } from 'typeorm';
import UsersRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';

interface IPaginateUser {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  prev_page: number | null;
  next_page: number | null;
  last_page: number;
  data: User[];
}

class ListUserService {
  public async execute(): Promise<IPaginateUser> {
    const usersRepository = getCustomRepository(UsersRepository);
    const users = await usersRepository.createQueryBuilder().paginate();

    return users as IPaginateUser;
  }
}

export default ListUserService;
