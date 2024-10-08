import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from './routes';
import AppError from '@shared/errors/AppError';
import '@shared/infra/typeorm';
import { errors } from 'celebrate';
import { pagination } from 'typeorm-pagination';
import uploadConfig from '@config/upload';
import rateLimiter from './middlewares/rateLimiter';
import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());

app.use(rateLimiter);

app.use(pagination);
app.use('/files', express.static(uploadConfig.directory));

app.use(routes);

app.use(errors());

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    });
  }

  return res.status(500).json({
    status: error,
    message: 'Internal Server Error',
  });
});

app.listen(3333, () => {
  console.log('Server running on port 3333! 🏆');
});
