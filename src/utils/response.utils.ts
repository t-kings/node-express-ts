/**
 * @description Manage Server responses
 */
import { Response } from 'express';
import { ResponseStatus, ResponseType } from '../types/response.types';

/**
 *
 * @param res Response object
 * @param data optional data to send to client
 * @returns express server response
 */
const internalServerError = (
  res: Response,
  data?: Partial<ResponseType<unknown>>
) => {
  return res.status(500).json({
    message: data?.message || 'internal server error',
    data: data?.data || {},
    meta: data?.meta || {},
    status: ResponseStatus.Error
  });
};

/**
 *
 * @param res Response object
 * @param data optional data to send to client
 * @returns express server response
 */
const httpOk = (res: Response, data?: Partial<ResponseType<unknown>>) => {
  return res.status(200).json({
    message: data?.message || 'process successful',
    data: data?.data || {},
    meta: data?.meta || {},
    status: ResponseStatus.Success
  });
};

/**
 *
 * @param res Response object
 * @param data optional data to send to client
 * @returns express server response
 */
const validationError = (
  res: Response,
  data?: Partial<ResponseType<unknown>>
) => {
  return res.status(400).json({
    message: data?.message || 'validation error',
    data: data?.data || {},
    meta: data?.meta || {},
    status: ResponseStatus.Error
  });
};

/**
 *
 * @param res Response object
 * @param data optional data to send to client
 * @returns express server response
 */
const conflictError = (
  res: Response,
  data?: Partial<ResponseType<unknown>>
) => {
  return res.status(409).json({
    message: data?.message || 'conflict',
    data: data?.data || {},
    meta: data?.meta || {},
    status: ResponseStatus.Error
  });
};

/**
 *
 * @param res Response object
 * @param data optional data to send to client
 * @returns express server response
 */
const httpCreated = (res: Response, data?: Partial<ResponseType<unknown>>) => {
  return res.status(201).json({
    message: data?.message || 'created successfully',
    data: data?.data || {},
    meta: data?.meta || {},
    status: ResponseStatus.Success
  });
};

/**
 *
 * @param res Response object
 * @param data optional data to send to client
 * @returns express server response
 */
const notFoundError = (
  res: Response,
  data?: Partial<ResponseType<unknown>>
) => {
  return res.status(404).json({
    message: data?.message || 'resource(s) not found',
    data: data?.data || {},
    meta: data?.meta || {},
    status: ResponseStatus.Error
  });
};

export const httpResponse = {
  httpCreated,
  httpOk,
  validationError,
  internalServerError,
  conflictError,
  notFoundError
};
