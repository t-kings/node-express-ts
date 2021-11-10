/**
 * @description Unit Test for schemaValidator
 */

import { Op } from 'sequelize';
import { Item } from '../../database';
import { clearMockFromDatabase } from '../../helpers';
import {
  addService,
  deleteExpiredItemsService,
  quantityService,
  sellService
} from './item.service';

const now = new Date().getTime();

describe('Item Service', () => {
  const item = 'foo';
  describe('addService', () => {
    const data = {
      expiry: now + 1000000000,
      quantity: 5
    };
    it('should add an item if not exists with expiry', async () => {
      const res = await addService(item, data);
      expect(res).toBeTruthy();
      const _item = await Item.findOne({
        where: {
          item,
          expiry: data.expiry,
          quantity: data.quantity
        },
        raw: true
      });
      expect(!!_item).toBeTruthy();
    });

    it('should update an item if exist with expiry', async () => {
      const res = await addService(item, data);
      expect(res).toBeTruthy();
      const _item = await Item.findOne({
        where: {
          item,
          expiry: data.expiry,
          quantity: 10 // updated quantity
        },
        raw: true
      });
      expect(!!_item).toBeTruthy();
    });
  });

  describe('quantityService', () => {
    it('should return an object containing  validTill and quantity', async () => {
      const res = await quantityService(item);
      expect(res?.validTill).toBeDefined();
      expect(res?.quantity).toBeDefined();
    });

    it('should return validTill as nearest expiry and quantity as total of all', async () => {
      const res = await quantityService(item);
      const now = new Date().getTime();
      expect(res?.quantity).toBeGreaterThan(0);
      expect(res?.validTill).toBeLessThan(Infinity);
      const items = await Item.findAll({
        where: {
          item,
          expiry: {
            [Op.gte]: now
          },
          quantity: {
            [Op.gt]: 0
          }
        },
        raw: true
      });

      // get nearest expiry
      const sortedItemsByExpiry = items.sort((a, b) => {
        const _a = a.toJSON() as { quantity: number; expiry: number };
        const _b = b.toJSON() as { quantity: number; expiry: number };
        return _a.expiry - _b.expiry;
      });
      const smallestExpiry = (
        sortedItemsByExpiry[0].toJSON() as {
          quantity: number;
          expiry: number;
        }
      ).expiry;
      expect(smallestExpiry).toEqual(res?.validTill);

      // get all quantity
      const reducedItem = items.reduce((prev, current) => {
        const _current = current.toJSON() as {
          quantity: number;
        };
        return prev + _current.quantity;
      }, 0);
      expect(reducedItem).toEqual(res?.quantity);
    });

    it('should return false on quantity', async () => {
      await clearMockFromDatabase();
      const res = await quantityService(item);
      expect(res).toBeFalsy();
    });
  });

  describe('sellService', () => {
    const data = {
      expiry: now + 1000000000,
      quantity: 5000
    };
    beforeEach(async () => {
      return await addService(item, data);
    });
    it('should sell item if less than', async () => {
      const quantity = await quantityService(item);
      const quantityToSell = 100;
      await sellService(item, { quantity: quantityToSell });
      const newQuantity = await quantityService(item);
      expect(quantity.quantity - newQuantity.quantity).toEqual(quantityToSell);
    });

    it('should sell item if greater than', async () => {
      await sellService(item, {
        quantity: data.quantity * data.quantity * data.quantity
      });
      const quantity = await quantityService(item);
      expect(quantity.quantity).toEqual(0);
    });

    it('should return false if nothing to sell', async () => {
      await sellService(item, {
        quantity: data.quantity * data.quantity * data.quantity
      });
      const res = await sellService(item, {
        quantity: data.quantity * data.quantity * data.quantity
      });
      expect(res).toBeFalsy();
    });
  });

  describe('deleteExpiredItemsService', () => {
    beforeEach(async () => {
      return await clearMockFromDatabase();
    });
    it('should  remove expired items', async () => {
      const data = {
        expiry: now - 1000000000,
        quantity: 0
      };
      await addService(item, data);

      await deleteExpiredItemsService();

      const quantity = await quantityService(item);
      expect(quantity.quantity).toEqual(0);
    });
  });
});
