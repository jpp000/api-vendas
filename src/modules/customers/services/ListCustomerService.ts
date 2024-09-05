import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { IPaginateCustomer } from '../domain/models/IPaginateCustomer';

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(): Promise<IPaginateCustomer> {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    let customers = await redisCache.recover<IPaginateCustomer>(key);

    if (!customers) {
      customers = await this.customersRepository.createQueryBuilder();
      await redisCache.save(key, customers);
    }

    return customers as IPaginateCustomer;
  }
}

export default ListCustomerService;
