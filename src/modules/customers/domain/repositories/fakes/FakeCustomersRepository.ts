import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { ICreateCustomer } from '@modules/customers/domain/models/ICreateCustomer';
import { IPaginateCustomer } from '@modules/customers/domain/models/IPaginateCustomer';
import { v4 as uuidv4 } from 'uuid';

class FakeCustomersRepository implements ICustomersRepository {
  private customers: Customer[] = [];

  public async remove(customer: Customer): Promise<void> {
    const customerIdx = this.customers.findIndex(c => c.id === customer.id);
    this.customers.splice(customerIdx, 1);
  }

  public async create({ name, email }: ICreateCustomer): Promise<Customer> {
    const customer = new Customer();

    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;

    this.customers.push(customer);

    return customer;
  }

  public async save(customer: Customer): Promise<Customer> {
    const customerIdx = this.customers.findIndex(c => c.id === customer.id);
    this.customers[customerIdx] = customer;

    return customer;
  }

  public async listAll(): Promise<IPaginateCustomer | null> {
    return this.customers as unknown as IPaginateCustomer;
  }

  public async findById(id: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.id === id);

    return customer;
  }

  public async findByName(name: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.name === name);

    return customer;
  }

  public async findByEmail(email: string): Promise<Customer | undefined> {
    const customer = this.customers.find(customer => customer.email === email);

    return customer;
  }
}

export default FakeCustomersRepository;
