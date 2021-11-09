/**
 * @description routes for :item
 */

import { itemController } from '../app';
import { MethodType } from '../types/request.types';
import express from 'express';
import { validator } from '../middlewares';
const router = express.Router();

/**
 * List of routes
 */
const routes = [
  {
    path: '/',
    handler: itemController.index,
    method: MethodType.Get,
    middlewares: []
  },
  {
    path: '/:item/add',
    handler: itemController.add,
    method: MethodType.Post,
    middlewares: [
      validator.bind({
        schema: {
          quantity: {
            required: true,
            type: 'number'
          },
          expiry: {
            required: true,
            type: 'number',
            min: new Date().getTime()
          }
        }
      })
    ]
  },
  {
    path: '/:item/quantity',
    handler: itemController.quantity,
    method: MethodType.Get,
    middlewares: []
  },
  {
    path: '/:item/sell',
    handler: itemController.sell,
    method: MethodType.Post,
    middlewares: [
      validator.bind({
        schema: {
          quantity: {
            required: true,
            type: 'number'
          }
        }
      })
    ]
  }
];

/**
 * map routes to router
 */
routes.forEach((route) => {
  router[route.method](route.path, route.middlewares, route.handler);
});

export const itemRoutes = { router, entry: '/' };
