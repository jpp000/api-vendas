import { IUsersRepository } from '@modules/users/domain/repositories/IUsersRepository';
import { ICreateUser } from '@modules/users/domain/models/ICreateUser';
import { IPaginateUser } from '@modules/users/domain/models/IPaginateUser';
import User from '@modules/users/infra/typeorm/entities/User';
import { v4 as uuidv4 } from 'uuid';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async remove(customer: User): Promise<void> {
    const customerIdx = this.users.findIndex(c => c.id === customer.id);
    this.users.splice(customerIdx, 1);
  }

  public async create({ name, email, password }: ICreateUser): Promise<User> {
    const customer = new User();

    customer.id = uuidv4();
    customer.name = name;
    customer.email = email;
    customer.password = password;

    this.users.push(customer);

    return customer;
  }

  public async save(customer: User): Promise<User> {
    const customerIdx = this.users.findIndex(c => c.id === customer.id);
    this.users[customerIdx] = customer;

    return customer;
  }

  public async listAll(): Promise<IPaginateUser | null> {
    return this.users as unknown as IPaginateUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const customer = this.users.find(customer => customer.id === id);

    return customer;
  }

  public async findByName(name: string): Promise<User | undefined> {
    const customer = this.users.find(customer => customer.name === name);

    return customer;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const customer = this.users.find(customer => customer.email === email);

    return customer;
  }
}

export default FakeUsersRepository;
