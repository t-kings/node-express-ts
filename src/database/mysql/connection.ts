/**
 * @description MySQL Connection
 */

import { Sequelize } from 'sequelize';
import { AddLog, DeleteLog, Item, SellLog } from '.';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @returns promise<connection or false>
 */
export const mysqlDatabase = async (callbackError?: any) => {
  try {
    const sequelize = new Sequelize({
      host: process.env.MYSQL_HOST,
      dialect: 'mysql',
      database: process.env.MYSQL_DATABASE,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD || undefined
    });
    await sequelize.authenticate();
    // Create tables
    await Item.sync();
    await AddLog.sync();
    await SellLog.sync();
    await DeleteLog.sync();
    console.info('Connection to database has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (callbackError) callbackError();
    return false;
  }
};
