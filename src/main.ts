/**
 * @description Server configuration
 */

import express from 'express';
import { itemRoutes } from './routes';
const app = express();

app.use(itemRoutes.entry, itemRoutes.router);

export const server = app;
