/**
 * @description schema for Add Log
 */

import { Sequelize, Model, DataTypes } from 'sequelize';
const sequelize = new Sequelize('mysql::memory:');

export class AddLog extends Model {}
AddLog.init(
  {
    item: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    expiry: { type: DataTypes.NUMBER, allowNull: false }
  },
  { sequelize, modelName: 'addLog', timestamps: true }
);
