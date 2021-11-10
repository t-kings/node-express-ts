/**
 * @description Manage services of item
 */

import { Item, SellLog } from '../../database';
import { Op } from 'sequelize';
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
  const _item = await Item.findOne({
    where: {
      item,
      expiry: data.expiry
    },
    raw: true
  });

  if (!_item) {
    await Item.create({ quantity: data.quantity, expiry: data.expiry, item });
  } else {
    const _itemJson = _item.toJSON() as { quantity: number; expiry: number };
    await _item.update({ quantity: _itemJson.quantity + data.quantity });
  }
  return true;
};

/**
 *
 * @param data data to process
 */
export const quantityService = async (item: string) => {
  const now = new Date().getTime();
  const items = await Item.findAll({
    where: {
      item,
      expiry: {
        [Op.gte]: now + deadZone
      },
      quantity: {
        [Op.gt]: 0
      }
    },
    raw: true
  });

  return items.reduce(
    (prev, current) => {
      const _current = current.toJSON() as { quantity: number; expiry: number };
      return {
        quantity: prev.quantity + _current.quantity,
        validTill:
          _current.expiry <= prev.validTill ? _current.expiry : prev.validTill
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
  const items = await Item.findAll({
    where: {
      item,
      expiry: {
        [Op.gte]: now + deadZone
      },
      quantity: {
        [Op.gt]: 0
      }
    },
    raw: true
  });

  const reducedItem = items.reduce(
    (prev, current) => {
      const _current = current.toJSON() as { quantity: number; expiry: number };
      return {
        quantity: prev.quantity + _current.quantity,
        validTill:
          _current.expiry <= prev.validTill ? _current.expiry : prev.validTill
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
    const _a = a.toJSON() as { quantity: number; expiry: number };
    const _b = b.toJSON() as { quantity: number; expiry: number };
    return _a.expiry - _b.expiry;
  });

  let quantityLeftToSell = data.quantity;

  /**
   * Sell from nearest to expiry
   */
  for (let index = 0; index < sortedItemsByExpiry.length; index++) {
    const _item = sortedItemsByExpiry[index];
    const _itemJson = _item.toJSON() as { quantity: number; expiry: number };
    if (_itemJson.quantity > quantityLeftToSell) {
      await _item.update({ quantity: _itemJson.quantity - quantityLeftToSell });
      break;
    } else {
      quantityLeftToSell = quantityLeftToSell - _itemJson.quantity;
      await _item.update({ quantity: 0 });
      if (quantityLeftToSell === 0) {
        break;
      }
    }
  }

  const quantitySold = data.quantity - quantityLeftToSell;
  await SellLog.create({ item, quantity: quantitySold });
  return quantitySold;
};

/**
 * @description remove expired items
 */
export const deleteExpiredItemsService = async () => {
  const now = new Date().getTime();
  await Item.destroy({
    where: {
      [Op.or]: {
        expiry: {
          [Op.lte]: now
        },
        quantity: 0
      }
    }
  });
  return true;
};
