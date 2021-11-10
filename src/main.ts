/**
 * @description Server configuration
 */

import express from 'express';
import { responseTransformer } from './interceptors';
import { itemRoutes } from './routes';
import { mysqlDatabase } from './database';
const app = express();

/**
 * Bind routers
 */
app.use(itemRoutes.entry, itemRoutes.router);

/**
 * Bind middleware
 */
app.use(responseTransformer);

/**
 * Initiate database
 */
mysqlDatabase();

export const server = app;
