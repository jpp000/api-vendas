import { ICreateOrder } from '../models/ICreateOrder';
import { IOrder } from '../models/IOrder';

export interface IOrdersRepository {
  findById(id: string): Promise<IOrder | undefined>;
  create({ customer, products }: ICreateOrder): Promise<IOrder>;
}
