/**
 * @description Server configuration
 */
import dotenv from 'dotenv';
import express from 'express';
import { responseTransformer } from './interceptors';
import { itemRoutes } from './routes';
import { mysqlDatabase } from './database';

// Initialize env
dotenv.config();

// Initialize express
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
 * * kill instance if connection fails
 */
mysqlDatabase(process.exit);

export const server = app;
