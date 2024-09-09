import FakeCustomersRepository from '@modules/customers/domain/repositories/fakes/FakeCustomersRepository';
import FakeOrdersRepository from '../domain/repositories/fakes/FakeOrdersRepository';
import FakeProductRepository from '@modules/products/domain/repositories/fakes/FakeProductRepository';
import CreateOrderService from './CreateOrderService';
import AppError from '@shared/errors/AppError';
import { IProduct } from '@modules/products/domain/models/IProduct';

let fakeOrdersRepository: FakeOrdersRepository;
let fakeCustomersRepository: FakeCustomersRepository;
let fakeProductRepository: FakeProductRepository;

let createOrder: CreateOrderService;

describe('CreateOrder', () => {
  beforeEach(() => {
    fakeOrdersRepository = new FakeOrdersRepository();
    fakeCustomersRepository = new FakeCustomersRepository();
    fakeProductRepository = new FakeProductRepository();

    createOrder = new CreateOrderService(
      fakeOrdersRepository,
      fakeCustomersRepository,
      fakeProductRepository,
    );
  });

  it('should not create an order if the customer does not exist', async () => {
    const products: IProduct[] = [
      {
        id: 'product-id-1',
        name: 'Product 1',
        price: 100,
        quantity: 5,
        created_at: new Date(),
        updated_at: new Date(),
        order_products: [],
      },
    ];

    await expect(
      createOrder.execute({
        customer_id: 'non-existing-customer-id',
        products,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create an order if a product does not exist', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Customer Name',
      email: 'customer@example.com',
    });

    const products: IProduct[] = [
      {
        id: 'non-existing-product-id',
        name: 'Non-existing Product',
        price: 100,
        quantity: 5,
        created_at: new Date(),
        updated_at: new Date(),
        order_products: [],
      },
    ];

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create an order if the product quantity is not available', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Customer Name',
      email: 'customer@example.com',
    });

    const product = await fakeProductRepository.create({
      name: 'Product Name',
      price: 100,
      quantity: 5,
    });

    const products: IProduct[] = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 10,
        created_at: product.created_at,
        updated_at: product.updated_at,
        order_products: [],
      },
    ];

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not create an order if some products are not found', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Customer Name',
      email: 'customer@example.com',
    });

    const existingProduct = await fakeProductRepository.create({
      name: 'Existing Product',
      price: 50,
      quantity: 10,
    });

    const products = [
      {
        id: existingProduct.id,
        name: 'Existing Product',
        price: 50,
        quantity: 5,
        created_at: new Date(),
        updated_at: new Date(),
        order_products: [],
      },
      {
        id: 'non-existing-product-id',
        name: 'Non-existing Product',
        price: 100,
        quantity: 5,
        created_at: new Date(),
        updated_at: new Date(),
        order_products: [],
      },
    ];

    await expect(
      createOrder.execute({
        customer_id: customer.id,
        products,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should create a new order with valid customer and products', async () => {
    const customer = await fakeCustomersRepository.create({
      name: 'Customer Name',
      email: 'customer@example.com',
    });

    const product = await fakeProductRepository.create({
      name: 'Product Name',
      price: 100,
      quantity: 10,
    });

    const products: IProduct[] = [
      {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 5,
        created_at: product.created_at,
        updated_at: product.updated_at,
        order_products: [],
      },
    ];

    const order = await createOrder.execute({
      customer_id: customer.id,
      products,
    });

    expect(order).toHaveProperty('id');
    expect(order.customer).toEqual(customer);
  });
});
