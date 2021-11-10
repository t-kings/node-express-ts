/**
 * @description schema for Item
 */

import { Sequelize, Model, DataTypes } from 'sequelize';
const sequelize = new Sequelize('sqlite::memory:');

export class Item extends Model {}
Item.init(
  {
    item: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    expiry: { type: DataTypes.NUMBER, allowNull: false }
  },
  { sequelize, modelName: 'item', timestamps: true }
);
