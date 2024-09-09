import FakeCacheProvider from '@shared/cache/fakes/FakeCacheProvider';
import FakeProductRepository from '../domain/repositories/fakes/FakeProductRepository';
import ListProductService from './ListProductService';
import Product from '../infra/typeorm/entities/Product';
import { IPaginateProduct } from '@modules/products/domain/models/IPaginateProduct';

let fakeProductRepository: FakeProductRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProducts: ListProductService;

describe('ListProducts', () => {
  beforeEach(() => {
    fakeProductRepository = new FakeProductRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProducts = new ListProductService(
      fakeProductRepository,
      fakeCacheProvider,
    );
  });

  it('should list all products from repository if cache is empty', async () => {
    await fakeProductRepository.create({
      name: 'Product',
      quantity: 1,
      price: 10,
    });

    await fakeProductRepository.create({
      name: 'Product1',
      quantity: 2,
      price: 20,
    });

    const products = await listProducts.execute();

    const list: IPaginateProduct = {
      from: 1,
      to: 10,
      per_page: 10,
      total: 2,
      current_page: 1,
      last_page: 1,
      data: products as unknown as Product[],
    };

    expect(list.data.length).toBe(2);
    expect(list.data[0].name).toBe('Product');
    expect(list.data[1].name).toBe('Product1');
  });

  it('should verify if cache provider functions are being called', async () => {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    const recoverSpy = jest.spyOn(fakeCacheProvider, 'recover');
    const saveSpy = jest.spyOn(fakeCacheProvider, 'save');

    await fakeProductRepository.create({
      name: 'Product',
      quantity: 1,
      price: 10,
    });

    await fakeProductRepository.create({
      name: 'Product1',
      quantity: 2,
      price: 20,
    });

    await listProducts.execute();

    expect(recoverSpy).toHaveBeenCalledWith(key);

    const products = await fakeProductRepository.listAll();
    expect(saveSpy).toHaveBeenCalledWith(key, products);
  });

  it('should use cache if data is already present', async () => {
    const key = process.env.CUSTOMER_CACHE_PREFIX as string;

    await fakeProductRepository.create({
      name: 'Product',
      quantity: 1,
      price: 10,
    });

    await fakeProductRepository.create({
      name: 'Product1',
      quantity: 2,
      price: 20,
    });

    const products = await fakeProductRepository.listAll();
    await fakeCacheProvider.save(key, products);

    const recoverSpy = jest.spyOn(fakeCacheProvider, 'recover');
    const saveSpy = jest.spyOn(fakeCacheProvider, 'save');

    const cachedProducts = await listProducts.execute();

    const list: IPaginateProduct = {
      from: 1,
      to: 10,
      per_page: 10,
      total: 2,
      current_page: 1,
      last_page: 1,
      data: cachedProducts as unknown as Product[],
    };

    expect(recoverSpy).toHaveBeenCalledWith(key);
    expect(saveSpy).not.toHaveBeenCalled();

    expect(list.data.length).toBe(2);
    expect(list.data[0].name).toBe('Product');
    expect(list.data[1].name).toBe('Product1');
  });
});
