import { itemController } from '../app';
import { MethodType } from '../types/request.types';
import express from 'express';
import { validator } from '../middlewares';
const router = express.Router();

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
        fields: {
          quantity: {
            required: true,
            type: 'number'
          },
          expiry: {
            required: true,
            type: 'number',
            max: new Date().getTime()
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
        fields: {
          quantity: {
            required: true,
            type: 'number'
          }
        }
      })
    ]
  }
];

routes.forEach((route) => {
  router[route.method](route.path, route.middlewares, route.handler);
});

export const itemRoutes = { router, entry: '/' };
