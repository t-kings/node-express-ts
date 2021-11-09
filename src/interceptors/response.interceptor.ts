/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description transforms all server response
 */
import { Request, Response } from 'express';
import { ResponseStatus } from '../types/response.types';

export function responseTransformer(
  req: Request,
  res: Response,
  next: () => void
) {
  try {
    const oldJson = res.json;
    res.json = function (body) {
      body = {
        status: body.status || ResponseStatus.Error,
        data: body.data || {},
        meta: body.meta || {},
        message: body.message || 'server defaults default message'
      };
      return oldJson.apply(res, body);
    };
  } catch {
    //
  } finally {
    next();
  }
}
