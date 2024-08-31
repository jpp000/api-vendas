import { getCustomRepository } from 'typeorm';
import Customer from '../typeorm/entities/Customer';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
import RedisCache from '@shared/cache/RedisCache';

interface IPaginateCustomer {
  from: number;
  to: number;
  per_page: number;
  total: number;
  current_page: number;
  last_page: number | null;
  next_page?: number | null;
  data: Customer[];
}

class ListCustomerService {
  public async execute(): Promise<IPaginateCustomer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const redisCache = new RedisCache();
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    let customers = await redisCache.recover<IPaginateCustomer>(key);

    if (!customers) {
      customers = await customersRepository.createQueryBuilder().paginate();
      await redisCache.save(key, customers);
    }

    return customers as IPaginateCustomer;
  }
}

export default ListCustomerService;
