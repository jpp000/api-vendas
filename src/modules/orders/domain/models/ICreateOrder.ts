import { ICustomer } from '@modules/customers/domain/models/ICustomer';
import { IProductOrder } from './IProductOrder';

export interface ICreateOrder {
  customer: ICustomer;
  products: IProductOrder[];
}
