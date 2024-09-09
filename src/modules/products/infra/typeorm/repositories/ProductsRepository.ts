import { getRepository, In, Repository } from 'typeorm';
import Product from '../entities/Product';
import { ICreateProduct } from '@modules/products/domain/models/ICreateProduct';
import { IProductRepository } from '@modules/products/domain/repositories/IProductRepository';
import { IUpdateStockProduct } from '@modules/products/domain/models/IUpdateStockProduct';
import { IPaginateProduct } from '@modules/products/domain/models/IPaginateProduct';

interface IFindProducts {
  id: string;
}

export class ProductRepository implements IProductRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async remove(product: Product): Promise<void> {
    await this.ormRepository.remove(product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProduct): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async save(product: Product): Promise<Product> {
    await this.ormRepository.save(product);

    return product;
  }

  public async listAll(): Promise<IPaginateProduct> {
    return await this.ormRepository.createQueryBuilder().paginate();
  }

  public async updateStock(products: IUpdateStockProduct[]): Promise<void> {
    await this.ormRepository.save(products);
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        name,
      },
    });

    return product;
  }

  public async findById(id: string): Promise<Product | undefined> {
    const product = await this.ormRepository.findOne({
      where: {
        id,
      },
    });

    return product;
  }

  public async findAllByIds(products: IFindProducts[]): Promise<Product[]> {
    const productIds = products.map(product => product.id);
    const existsProducts = await this.ormRepository.find({
      where: {
        id: In(productIds),
      },
    });

    return existsProducts;
  }
}
