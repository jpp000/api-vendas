import { Request, Response } from 'express';
import CreateSessionsService from '../../../services/CreateSessionsService';
import { instanceToInstance } from 'class-transformer';
import { container } from 'tsyringe';

class SessionsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    const createSession = container.resolve(CreateSessionsService);

    const user = await createSession.execute({ email, password });

    return res.json(instanceToInstance(user));
  }
}

export default SessionsController;
