import AppError from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { inject, injectable } from 'tsyringe';

@injectable()
class DeleteCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    await this.customersRepository.remove(customer);

    const key = process.env.CUSTOMER_CACHE_PREFIX as string;
    redisCache.invalidate(key);
  }
}

export default DeleteCustomerService;
