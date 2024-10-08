import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import { ICustomersRepository } from '../domain/repositories/ICustomersRepository';

@injectable()
class ShowCustomerService {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute(id: string) {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new AppError('Customer not found');
    }

    return customer;
  }
}

export default ShowCustomerService;
