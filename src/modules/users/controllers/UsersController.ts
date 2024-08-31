import { Request, Response } from 'express';
import ListUserService from '../services/ListUserService';
import CreateUserService from '../services/CreateUserService';
import { instanceToInstance } from 'class-transformer';
import DeleteUserService from '../services/DeleteUserService';

class UsersController {
  public async index(req: Request, res: Response): Promise<Response> {
    const listUsers = new ListUserService();
    const users = await listUsers.execute();

    return res.json(instanceToInstance(users));
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const createUser = new CreateUserService();
    const user = await createUser.execute({
      name,
      email,
      password,
    });

    return res.json(instanceToInstance(user));
  }

  public async remove(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteUser = new DeleteUserService();
    const user = deleteUser.execute({ id });

    return res.json(instanceToInstance(user));
  }
}

export default UsersController;
