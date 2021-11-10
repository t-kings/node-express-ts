/**
 * @description Manage Workers
 */

import { deleteExpiredItemsService } from '../app/item/item.service';

/**
 * initiate all workers
 */
export const initWorkers = () => {
  // workers for expired items
  const clearExpiredItems = async () => {
    await deleteExpiredItemsService();
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      clearExpiredItems();
    }, 1000 * 60 * 2);
  };
};
