import AppError from '@shared/errors/AppError';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { inject, injectable } from 'tsyringe';
import { ICacheProvider } from '@shared/cache/models/ICacheProvider';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('CacheProvider')
    private redisCache: ICacheProvider,
  ) {}

  public async execute(id: string): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    await this.customersRepository.remove(customer);

    const key = process.env.CUSTOMER_CACHE_PREFIX as string;
    await this.redisCache.invalidate(key);
  }
}

export default DeleteCustomerService;
