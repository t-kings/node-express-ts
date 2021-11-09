/**
 * @description Server configuration
 */

import express from 'express';
import { responseTransformer } from './interceptors';
import { itemRoutes } from './routes';
const app = express();

/**
 * Bind routers
 */
app.use(itemRoutes.entry, itemRoutes.router);

/**
 * Bind middleware
 */
app.use(responseTransformer);

export const server = app;
