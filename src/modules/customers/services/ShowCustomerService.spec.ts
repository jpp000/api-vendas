import AppError from '@shared/errors/AppError';
import FakeCustomersRepository from '../domain/repositories/fakes/FakeCustomersRepository';
import ShowCustomerService from './ShowCustomerService';

let fakeCustomersRepository: FakeCustomersRepository;
let showCustomer: ShowCustomerService;

describe('ShowCustomer', () => {
  beforeEach(() => {
    fakeCustomersRepository = new FakeCustomersRepository();
    showCustomer = new ShowCustomerService(fakeCustomersRepository);
  });

  it('should show customer', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Joao',
      email: 'teste@teste.com',
    });

    const customerFound = await showCustomer.execute(customer.id);

    expect(customerFound.name).toBe('Joao');
    expect(customerFound.email).toBe('teste@teste.com');
  });

  it('should throw an error if customer does not exist', async () => {
    await expect(
      showCustomer.execute('non-existing-id'),
    ).rejects.toBeInstanceOf(AppError);
  });
});
