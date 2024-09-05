import { IPaginateProduct } from '@modules/products/services/ListProductService';
import { ICreateProduct } from '../models/ICreateProduct';
import { IProduct } from '../models/IProduct';

interface IFindProducts {
  id: string;
}

export interface IProductRepository {
  findByName(name: string): Promise<IProduct | undefined>;
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | undefined>;
  save(product: IProduct): Promise<IProduct>;
  create({ name, price, quantity }: ICreateProduct): Promise<IProduct>;
  remove(product: IProduct): Promise<void>;
  createQueryBuilder(): Promise<IPaginateProduct>;
}
