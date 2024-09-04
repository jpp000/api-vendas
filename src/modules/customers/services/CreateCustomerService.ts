import { getCustomRepository } from 'typeorm';
import CustomersRepository from '../infra/typeorm/repositories/CustomersRepository';
import AppError from '@shared/errors/AppError';
import redisCache from '@shared/cache/RedisCache';

interface IRequest {
  name: string;
  email: string;
}

class CreateCustomersService {
  public async execute({ name, email }: IRequest) {
    const customersRepository = getCustomRepository(CustomersRepository);
    const emailExists = await customersRepository.findByEmail(email);

    if (emailExists) {
      throw new AppError('Email address already used.');
    }

    const customer = customersRepository.create({
      name,
      email,
    });

    await customersRepository.save(customer);

    const key = process.env.CUSTOMER_CACHE_PREFIX as string;
    redisCache.invalidate(key);

    return customer;
  }
}

export default CreateCustomersService;
