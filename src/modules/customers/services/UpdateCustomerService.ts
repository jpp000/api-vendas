import Customer from '../infra/typeorm/entities/Customer';
import AppError from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';
import { inject, injectable } from 'tsyringe';
import { IRequestUpdateCustomer } from '../domain/models/IRequestUpdateCustomer';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class UpdateCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
  }: IRequestUpdateCustomer): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    const customerExists = await this.customersRepository.findByEmail(email);

    if (customerExists && email !== customer.email) {
      throw new AppError('There is already one customer with this email');
    }

    customer.name = name;
    customer.email = email;

    this.customersRepository.save(customer);

    const key = process.env.CUSTOMER_CACHE_PREFIX as string;
    redisCache.invalidate(key);

    return customer;
  }
}

export default UpdateCustomerService;
