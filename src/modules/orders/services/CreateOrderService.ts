import Order from '../infra/typeorm/entities/Order';
import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IOrdersRepository } from '../domain/repositories/IOrdersRepository';
import { ICustomersRepository } from '@modules/customers/domain/repositories/ICustomersRepository';
import { IProductRepository } from '@modules/products/domain/repositories/IProductRepository';
import { IRequestCreateOrder } from '../domain/models/IRequestCreateOrder';

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRespository: IOrdersRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,

    @inject('ProductRepository')
    private productsRepository: IProductRepository,
  ) {}

  public async execute({
    customer_id,
    products,
  }: IRequestCreateOrder): Promise<Order> {
    const customerExists = await this.customersRepository.findById(customer_id);

    if (!customerExists) {
      throw new AppError('Could not find any customer with the given id');
    }

    const productExists = await this.productsRepository.findAllByIds(products);

    if (!productExists.length) {
      throw new AppError('Could not find any products with the given ids');
    }

    const existsProductsIds = productExists.map(product => product.id);

    const checkInexistentProducts = products.filter(
      product => !existsProductsIds.includes(product.id),
    );

    if (checkInexistentProducts.length) {
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}`,
      );
    }

    const quantityAvailable = products.filter(
      product =>
        productExists.filter(p => p.id === product.id)[0].quantity <
        product.quantity,
    );

    if (quantityAvailable.length) {
      throw new AppError(
        `The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`,
      );
    }

    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: productExists.filter(p => p.id === product.id)[0].price,
    }));

    const order = await this.ordersRespository.create({
      customer: customerExists,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity:
        productExists.filter(p => p.id === product.product_id)[0].quantity -
        product.quantity,
    }));

    await this.productsRepository.updateStock(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
