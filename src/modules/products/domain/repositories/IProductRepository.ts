import { IPaginateProduct } from '@modules/products/services/ListProductService';
import { ICreateProduct } from '../models/ICreateProduct';
import { IProduct } from '../models/IProduct';
import { IUpdateStockProduct } from '../models/IUpdateStockProduct';

interface IFindProducts {
  id: string;
}

export interface IProductRepository {
  findByName(name: string): Promise<IProduct | undefined>;
  findAllByIds(products: IFindProducts[]): Promise<IProduct[]>;
  findById(id: string): Promise<IProduct | undefined>;
  updateStock(products: IUpdateStockProduct[]): Promise<void>;
  save(product: IProduct): Promise<IProduct>;
  create({ name, price, quantity }: ICreateProduct): Promise<IProduct>;
  remove(product: IProduct): Promise<void>;
  createQueryBuilder(): Promise<IPaginateProduct>;
}
