import Order from '@modules/orders/infra/typeorm/entities/Order';
import { ICreateOrder } from '../../models/ICreateOrder';
import { IOrdersRepository } from '../IOrdersRepository';
import { v4 as uuidv4 } from 'uuid';

class FakeOrdersRepository implements IOrdersRepository {
  private orders: Order[] = [];

  public async create({ customer, products }: ICreateOrder): Promise<Order> {
    const order = new Order();

    Object.assign(order, {
      id: uuidv4(),
      customer,
      order_products: products,
    });

    this.orders.push(order);

    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = this.orders.find(o => o.id === id);

    return order;
  }
}

export default FakeOrdersRepository;
