/**
 * @description Controllers for item
 */

import { Request, Response } from 'express';
import { httpResponse } from '../../utils';
import { addService, quantityService, sellService } from './item.service';

const index = async (req: Request, res: Response) => {
  try {
    return httpResponse.httpOk(res, { message: 'Server is up' });
  } catch (error) {
    return httpResponse.internalServerError(res);
  }
};

/**
 * @description add controller
 */
const add = async (req: Request, res: Response) => {
  try {
    const data = await addService(req.params.item, req.body);
    return httpResponse.httpCreated(res, { data });
  } catch (error) {
    return httpResponse.internalServerError(res);
  }
};

/**
 * @description quantity controller
 */
const quantity = async (req: Request, res: Response) => {
  try {
    const data = await quantityService(req.params.item);
    return data.quantity === 0
      ? httpResponse.notFoundError(res)
      : httpResponse.httpOk(res, { data });
  } catch (error) {
    return httpResponse.internalServerError(res);
  }
};

/**
 * @description sell Controller
 */
const sell = async (req: Request, res: Response) => {
  try {
    const data = await sellService(req.params.item, req.body);
    return data === false
      ? httpResponse.conflictError(res, { message: 'no item to sell' })
      : httpResponse.httpCreated(res, { message: `${data} sold` });
  } catch (error) {
    return httpResponse.internalServerError(res);
  }
};

export const itemController = {
  index,
  add,
  quantity,
  sell
};
