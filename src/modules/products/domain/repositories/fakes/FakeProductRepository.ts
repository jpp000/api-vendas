import { ICreateProduct } from '../../models/ICreateProduct';
import { IProduct } from '../../models/IProduct';
import { IProductRepository } from '../IProductRepository';
import { IUpdateStockProduct } from '../../models/IUpdateStockProduct';
import Product from '@modules/products/infra/typeorm/entities/Product';
import { v4 as uuidv4 } from 'uuid';
import { IPaginateProduct } from '../../models/IPaginateProduct';

class FakeProductRepository implements IProductRepository {
  private products: Product[] = [];

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<IProduct> {
    const product = new Product();

    product.id = uuidv4();
    product.name = name;
    product.price = price;
    product.quantity = quantity;

    this.products.push(product);

    return product;
  }

  public async findAllByIds(): Promise<IProduct[]> {
    return [];
  }

  public async findById(id: string): Promise<IProduct | undefined> {
    const product = this.products.find(p => p.id === id);

    return product;
  }

  public async findByName(name: string): Promise<IProduct | undefined> {
    const product = this.products.find(p => p.name === name);

    return product;
  }

  public async listAll(): Promise<IPaginateProduct> {
    return this.products as unknown as IPaginateProduct;
  }

  public async remove(product: IProduct): Promise<void> {
    const productIdx = this.products.findIndex(p => p === product);

    this.products.splice(productIdx, 1);
  }

  public async save(product: IProduct): Promise<IProduct> {
    const productIdx = this.products.findIndex(p => p.id === product.id);
    this.products[productIdx] = product;

    return product;
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    products;
  }
}

export default FakeProductRepository;
