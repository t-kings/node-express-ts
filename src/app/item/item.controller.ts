import { Request, Response } from 'express';
import { ResponseStatus } from '../../types/response.types';

const index = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Server is up',
    data: {},
    meta: {},
    status: ResponseStatus.Success
  });
};

const add = async (req: Request, res: Response) => {
  res.status(200).json({
    message: '',
    data: {},
    meta: {},
    status: ResponseStatus.Success
  });
};

const quantity = async (req: Request, res: Response) => {
  res.status(200).json({
    message: '',
    data: {},
    meta: {},
    status: ResponseStatus.Success
  });
};

const sell = async (req: Request, res: Response) => {
  res.status(200).json({
    message: '',
    data: {},
    meta: {},
    status: ResponseStatus.Success
  });
};
export const itemController = {
  index,
  add,
  quantity,
  sell
};
