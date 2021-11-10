/**
 * @description Unit Test for schemaValidator
 */

import { deepEqual } from 'assert';
import {
  Item,
  mysqlActions,
  mysqlDatabase,
  mysqlConnection
} from '../../database';
import { clearMockFromDatabase } from '../../helpers';
import {
  addService,
  deleteExpiredItemsService,
  quantityService,
  sellService
} from './item.service';

const now = new Date().getTime();

describe('', () => {
  beforeEach(async () => {
    // initialize database

    if (mysqlConnection.state === 'disconnected') {
      return mysqlDatabase();
    }

    return;
  });

  describe('Item Service', () => {
    const item = 'foo';
    describe('addService', () => {
      const data = {
        expiry: now + 1000 * 60 * 60,
        quantity: 5
      };
      it('should add an item if not exists with expiry', async () => {
        const res = await addService(item, data);
        expect(res).toBeTruthy();
        const _item = await mysqlActions.findOne(
          'item',
          `item = '${item}' AND expiry = '${data.expiry}'  AND quantity ='${data.quantity}'`
        );

        expect(!!_item).toBeTruthy();

        return '';
      });

      it('should update an item if exist with expiry', async () => {
        const res = await addService(item, data);
        expect(res).toBeTruthy();

        const _item = await mysqlActions.findOne(
          'item',
          `item = '${item}' AND expiry = '${
            data.expiry
          }'  AND quantity ='${10}'`
        );
        expect(!!_item).toBeTruthy();
        return '';
      });
    });

    describe('quantityService', () => {
      it('should return an object containing  validTill and quantity', async () => {
        const res = await quantityService(item);
        expect(res?.validTill).toBeDefined();
        expect(res?.quantity).toBeDefined();
        return '';
      });

      it('should return validTill as nearest expiry and quantity as total of all', async () => {
        const res = await quantityService(item);
        const now = new Date().getTime();
        expect(res?.quantity).toBeGreaterThan(0);
        expect(res?.validTill).toBeLessThan(Infinity);

        const items = (await mysqlActions.findAll(
          'item',
          `item = '${item}' AND expiry >= '${now}' AND quantity > '0'`
        )) as Item[];

        // get nearest expiry
        const sortedItemsByExpiry = items.sort((a, b) => {
          return a.expiry - b.expiry;
        });
        const smallestExpiry = sortedItemsByExpiry[0].expiry;
        expect(smallestExpiry).toEqual(res?.validTill);

        // get all quantity
        const reducedItem = items.reduce((prev, current) => {
          return prev + current.quantity;
        }, 0);
        expect(reducedItem).toEqual(res?.quantity);
        return '';
      });

      it('should return quantity as 0 and validTill at infinity if empty ', async () => {
        await clearMockFromDatabase();
        const res = await quantityService(item);
        deepEqual(res, { quantity: 0, validTill: Infinity });
        return '';
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
        expect(quantity.quantity - newQuantity.quantity).toEqual(
          quantityToSell
        );
        return '';
      });

      it('should sell item if greater than', async () => {
        await sellService(item, {
          quantity: data.quantity * data.quantity * data.quantity
        });
        const quantity = await quantityService(item);
        expect(quantity.quantity).toEqual(0);
        return '';
      });

      it('should return false if nothing to sell', async () => {
        await sellService(item, {
          quantity: data.quantity * data.quantity * data.quantity
        });
        const res = await sellService(item, {
          quantity: data.quantity * data.quantity * data.quantity
        });
        expect(res).toBeFalsy();
        return '';
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
        return '';
      });
    });
  });
});
