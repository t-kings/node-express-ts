/**
 * @description MySQL Connection
 */

import { Sequelize } from 'sequelize';
import { AddLog, DeleteLog, Item, SellLog } from '.';

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || '',
  process.env.MYSQL_USERNAME || '',
  process.env.MYSQL_PASSWORD || '',
  {
    host: process.env.MYSQL_HOST || '',
    dialect: 'mysql'
  }
);

/**
 * @returns promise<connection or false>
 */
export const mysqlDatabase = async () => {
  try {
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
    return false;
  }
};
