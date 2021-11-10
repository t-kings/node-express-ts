/**
 * @description schema for Item
 */

import { Sequelize, Model, DataTypes } from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

export class SellLog extends Model {}
SellLog.init(
  {
    item: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false }
  },
  { sequelize, modelName: 'sellLog', timestamps: true }
);
