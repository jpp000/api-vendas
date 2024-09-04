import { getCustomRepository } from 'typeorm';
import Order from '../infra/typeorm/entities/Order';
import OrdersRespository from '../infra/typeorm/repositories/OrdersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
}

class ShowOrderService {
  public async execute({ id }: IRequest): Promise<Order> {
    const ordersRespository = getCustomRepository(OrdersRespository);
    const order = await ordersRespository.findById(id);

    if (!order) {
      throw new AppError('Order not found');
    }

    return order;
  }
}

export default ShowOrderService;
