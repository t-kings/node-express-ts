/**
 * @description schema for Delete Log
 */

import { Sequelize, Model, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

export class DeleteLog extends Model {}
DeleteLog.init(
  {
    item: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    expiry: { type: DataTypes.NUMBER, allowNull: false }
  },
  { sequelize, modelName: 'deleteLog', timestamps: true }
);
