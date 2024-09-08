import { inject, injectable } from 'tsyringe';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { IPaginateCustomer } from '../domain/models/IPaginateCustomer';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

@injectable()
class ListCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute(): Promise<IPaginateCustomer> {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    let customers = await this.redisCache.recover<IPaginateCustomer>(key);

    if (!customers) {
      customers = await this.customersRepository.listAll();
      await this.redisCache.save(key, customers);
    }

    return customers as IPaginateCustomer;
  }
}

export default ListCustomerService;
