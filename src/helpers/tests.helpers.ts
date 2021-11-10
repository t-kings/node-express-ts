/**
 * Helpers for testing files
 */

import { mysqlActions } from '../database';

export const clearMockFromDatabase = async () => {
  const tables = ['item'];
  for (let index = 0; index < tables.length; index++) {
    const table = tables[index];
    await mysqlActions.clearTable(table);
  }

  return;
};
