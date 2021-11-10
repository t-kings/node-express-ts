/**
 * @description Manage services of item
 */

import { Item, mysqlActions } from '../../database';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @description this is a period of milliseconds interval you want to consider invalid
 */
const deadZone = parseInt(process.env.DEAD_ZONE || '0');

/**
 *
 * @param data data to process
 */
export const addService = async (item: string, data: Record<string, any>) => {
  try {
    console.log('data', data);

    const _item = (await mysqlActions.findOne(
      'item',
      `item = '${item}' AND expiry = '${data.expiry}'`
    )) as Item;

    if (!_item) {
      await mysqlActions.create('item', {
        quantity: data.quantity,
        expiry: data.expiry,
        item
      });
    } else {
      await mysqlActions.update(
        'item',
        `quantity = '${_item.quantity + data.quantity}'`,
        `id = '${_item.id}'`
      );
    }
    return true;
  } catch (e) {
    console.log(e);

    return false;
  }
};

/**
 *
 * @param data data to process
 */
export const quantityService = async (item: string) => {
  const now = new Date().getTime();
  const items = (await mysqlActions.findAll(
    'item',
    `item = '${item}' AND expiry >= '${now + deadZone}' AND quantity > '0'`
  )) as Item[];

  return items.reduce(
    (prev, current) => {
      return {
        quantity: prev.quantity + current.quantity,
        validTill:
          current.expiry <= prev.validTill ? current.expiry : prev.validTill
      };
    },
    {
      quantity: 0,
      validTill: Infinity
    }
  );
};

/**
 *
 * @param data data to process
 * @returns false | number of item sold
 */
export const sellService = async (item: string, data: Record<string, any>) => {
  const now = new Date().getTime();

  const items = (await mysqlActions.findAll(
    'item',
    `item = '${item}' AND expiry >= '${now + deadZone}' AND quantity > '0'`
  )) as Item[];

  const reducedItem = items.reduce(
    (prev, current) => {
      return {
        quantity: prev.quantity + current.quantity,
        validTill:
          current.expiry <= prev.validTill ? current.expiry : prev.validTill
      };
    },
    {
      quantity: 0,
      validTill: Infinity
    }
  );

  if (reducedItem.quantity === 0) {
    // not enough quantity to sell
    return false;
  }

  /**
   * Sort items from nearest to expire to farthest to expire
   */
  const sortedItemsByExpiry = items.sort((a, b) => {
    return a.expiry - b.expiry;
  });

  let quantityLeftToSell = data.quantity;

  /**
   * Sell from nearest to expiry
   */
  for (let index = 0; index < sortedItemsByExpiry.length; index++) {
    const _item = sortedItemsByExpiry[index];
    if (_item.quantity > quantityLeftToSell) {
      await mysqlActions.update(
        'item',
        `quantity = '${_item.quantity - quantityLeftToSell}'`,
        `id = '${_item.id}'`
      );
      break;
    } else {
      quantityLeftToSell = quantityLeftToSell - _item.quantity;
      await mysqlActions.update(
        'item',
        `quantity = '${0}'`,
        `id = '${_item.id}'`
      );
      if (quantityLeftToSell === 0) {
        break;
      }
    }
  }

  const quantitySold = data.quantity - quantityLeftToSell;
  return quantitySold;
};

/**
 * @description remove expired items
 */
export const deleteExpiredItemsService = async () => {
  const now = new Date().getTime();
  await mysqlActions.remove('item', `expiry <= '${now}' OR quantity = '0'`);
  return true;
};
