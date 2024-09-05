import AppError from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';
import { ICreateCustomer } from '../domain/models/ICreateCustomer';
import { ICustomer } from '../domain/models/ICustomer';
import { inject, injectable } from 'tsyringe';

@injectable()
class CreateCustomersService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: ICreateCustomer): Promise<ICustomer> {
    const emailExists = await this.customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const customer = await this.customersRepository.create({
      name,
      email,
    });

    const key = process.env.CUSTOMER_CACHE_PREFIX as string;
    redisCache.invalidate(key);

    return customer;
  }
}

export default CreateCustomersService;
