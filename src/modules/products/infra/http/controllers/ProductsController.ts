import { Request, Response } from 'express';
import ListProductService from '../../../services/ListProductService';
import ShowProductService from '../../../services/ShowProductService';
import CreateProductService from '../../../services/CreateProductService';
import UpdateProductService from '../../../services/UpdateProductService';
import DeleteProductService from '../../../services/DeleteProductService';
import { container } from 'tsyringe';

export default class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const ListProducts = container.resolve(ListProductService);
    const products = await ListProducts.execute();

    return res.json(products);
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const showProduct = container.resolve(ShowProductService);
    const product = await showProduct.execute(id);

    return res.json(product);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, price, quantity } = req.body;
    const createProduct = container.resolve(CreateProductService);

    const product = await createProduct.execute({
      name,
      price,
      quantity,
    });

    return res.json(product);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, price, quantity } = req.body;

    const updateProduct = container.resolve(UpdateProductService);
    const product = await updateProduct.execute({
      id,
      name,
      price,
      quantity,
    });

    return res.json(product);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const deleteProduct = container.resolve(DeleteProductService);

    await deleteProduct.execute(id);

    return res.json({ message: 'Product deleted' });
  }
}
