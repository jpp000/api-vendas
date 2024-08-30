import { EntityRepository, Repository } from 'typeorm';
import Order from '../entities/Order';
import Customer from '@modules/customers/typeorm/entities/Customer';

interface IProduct {
  product_id: string;
  price: number;
  quantity: number;
}

interface IRequest {
  customer: Customer;
  product: IProduct[];
}

@EntityRepository(Order)
class OrdersRespository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = this.findOne(id, {
      relations: ['order_products', 'customer'],
    });

    return order;
  }

  public async createOrder({ customer, product }: IRequest): Promise<Order> {
    const order = this.create({
      customer: customer,
      order_products: product,
    });

    await this.save(order);

    return order;
  }
}

export default OrdersRespository;
