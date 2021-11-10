/**
 * @description MySQL Connection
 */

import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

export const mysqlConnection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE || '',
  user: process.env.MYSQL_USERNAME || '',
  password: process.env.MYSQL_PASSWORD
});

/**
 * @returns promise<connection or false>
 */
export const mysqlDatabase = async (callbackError?: any) => {
  try {
    mysqlConnection.connect(async (err) => {
      if (err) throw err;
      console.log('Connected!');

      // Create item table
      await createTable(
        'item',
        'id INT AUTO_INCREMENT PRIMARY KEY, item VARCHAR(255), quantity BIGINT, expiry INT(11)'
      );
    });

    console.info('Connection to database has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (callbackError) callbackError();
    return false;
  }
};

/**
 * create table
 * @param tableName
 * @param column
 * @returns promise
 */
const createTable = async (tableName: string, column: string) => {
  return new Promise((resolve, reject) => {
    const itemSql = `CREATE TABLE IF NOT EXISTS ${tableName} (${column})`;
    mysqlConnection.query(itemSql, function (err) {
      if (err) reject(err);
      resolve('');
    });
  });
};

export const mysqlActions = {
  findAll: async (tableName: string, where: string) => {
    return new Promise((resolve, reject) => {
      const itemSql = `SELECT * FROM ${tableName} WHERE ${where}`;
      mysqlConnection.query(itemSql, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  findOne: async (tableName: string, where: string) => {
    return new Promise((resolve, reject) => {
      const itemSql = `SELECT * FROM ${tableName} WHERE ${where} LIMIT 1`;
      mysqlConnection.query(itemSql, function (err, result) {
        if (err) reject(err);
        resolve(result[0] || null);
      });
    });
  },
  create: async (
    tableName: string,
    fields: Record<string, string | number>
  ) => {
    return new Promise((resolve, reject) => {
      const itemSql = `INSERT INTO ${tableName} (${Object.keys(fields).join(
        ', '
      )}) VALUES (${Object.values(fields)
        .map((_f) => `'${_f}'`)
        .join(', ')})`;
      mysqlConnection.query(itemSql, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  update: async (tableName: string, values: string, where: string) => {
    return new Promise((resolve, reject) => {
      const itemSql = `UPDATE ${tableName}  SET ${values} WHERE ${where}`;
      mysqlConnection.query(itemSql, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  remove: async (tableName: string, where: string) => {
    return new Promise((resolve, reject) => {
      const itemSql = `DELETE FROM ${tableName}  WHERE ${where}`;
      mysqlConnection.query(itemSql, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  },

  clearTable: async (tableName: string) => {
    return new Promise((resolve, reject) => {
      const itemSql = `DELETE FROM ${tableName} `;
      mysqlConnection.query(itemSql, function (err, result) {
        if (err) reject(err);
        resolve(result);
      });
    });
  }
};
