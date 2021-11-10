/**
 * @description Server configuration
 */
import dotenv from 'dotenv';
import express from 'express';
import { responseTransformer } from './interceptors';
import { itemRoutes } from './routes';
import { mysqlDatabase } from './database';
import { bodyParser } from './middlewares';

// Initialize env
dotenv.config();

// Initialize express
const app = express();

/**
 * Bind middleware
 */
app.use(bodyParser);

/**
 * Bind routers
 */
app.use(itemRoutes.entry, itemRoutes.router);

// bind outgoing interceptors
app.use(responseTransformer);

/**
 * Initiate database
 * * kill instance if connection fails
 */
mysqlDatabase(process.exit);

export const server = app;
