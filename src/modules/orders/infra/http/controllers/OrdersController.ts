import { Request, Response } from 'express';
import ShowOrderService from '../../../services/ShowOrderService';
import CreateOrderService from '../../../services/CreateOrderService';
import { container } from 'tsyringe';

class OrdersController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const showOrder = container.resolve(ShowOrderService);

    const order = await showOrder.execute(id);

    return res.json(order);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { customer_id, products } = req.body;
    const createOrder = container.resolve(CreateOrderService);

    const order = await createOrder.execute({
      customer_id,
      products,
    });

    return res.json(order);
  }
}

export default OrdersController;
