/**
 * @description Integration Test for item paths
 * @path /
 */

import { clearMockFromDatabase, mockUpDatabase } from '../src/helpers';
import { server } from '../src/main';
import { ResponseType } from '../src/types/response.types';
import supertest from 'supertest';
import { checkReturnType } from './helpers';

const request = supertest(server);
const t0 = 1615525981224;

describe('Item (e2e)', () => {
  beforeEach(() => {
    /**
     * Mock up the test database
     */
    return mockUpDatabase();
  });

  afterEach(() => {
    /**
     *  Clear mock up from the test database
     */
    return clearMockFromDatabase();
  });

  describe('/wrong-path', () => {
    let status: number;
    const path = 'this/is/definitely/a/wrong/path';

    beforeEach(async () => {
      const res = await request.get(`/${path}`);
      status = res.status;
      return '';
    });

    it('should return 404', () => {
      expect(status).toBe(404);
    });
  });

  describe('/ (GET)', () => {
    let status: number;
    let data: ResponseType<unknown>;
    const path = '/';
    beforeEach(async () => {
      const res = await request.get(path);
      status = res.status;
      data = res.body;
      return '';
    });
    it('should return status 200', () => {
      expect(status).toBe(200);
    });

    it('should contain only keys of response type', () => {
      checkReturnType(data);
    });
  });
  /**
   * @path :item/add
   */
  describe('/:item/add', () => {
    describe('with good payload', () => {
      let status: number;
      let data: ResponseType<unknown>;
      const item = 'foo';
      const path = `${item}/add`;
      const payload = { expiry: t0 + 10000, quantity: 10 };
      beforeEach(async () => {
        const res = await request.post(`/${path}`).send(payload);
        status = res.status;
        data = res.body;
        return '';
      });
      it('should return 201', () => {
        expect(status).toBe(201);
      });

      it('should contain only keys of response type', () => {
        checkReturnType(data);
      });
    });
    describe('with bad payload', () => {
      let status: number;
      let data: ResponseType<unknown>;
      const item = 'foo';
      const path = `${item}/add`;
      const payload = {}; // wrong payload
      beforeEach(async () => {
        const res = await request.post(`/${path}`).send(payload);
        status = res.status;
        data = res.body;
        return '';
      });
      it('should return 400', () => {
        expect(status).toBe(400);
      });

      it('should contain only keys of response type', () => {
        checkReturnType(data);
      });
    });
  });

  /**
   * @path :item/quantity
   */
  describe('/:item/quantity', () => {
    describe('empty quantity', () => {
      let status: number;
      let data: ResponseType<unknown>;
      const item = 'foo';
      const path = `${item}/quantity`;
      beforeEach(async () => {
        clearMockFromDatabase();
        const res = await request.get(`/${path}`);
        status = res.status;
        data = res.body;
        return '';
      });
      it('should return 404', () => {
        expect(status).toBe(404);
      });

      it('should contain only keys of response type', () => {
        checkReturnType(data);
      });
    });
    describe('quantity exists', () => {
      let status: number;
      let data: ResponseType<{
        quantity: number;
        validTill: number;
      }>;
      const item = 'foo';
      const path = `${item}/quantity`;
      beforeEach(async () => {
        await clearMockFromDatabase();
        await mockUpDatabase();
        const res = await request.get(`/${path}`);
        status = res.status;
        data = res.body;
        return '';
      });
      it('should return 200', () => {
        expect(status).toBe(200);
      });
      it('should return validTill as the nearest expiry time', () => {
        const validTimeFromMockUp = 0;
        const now = new Date().getTime();
        expect(data.data.validTill).toBeGreaterThan(now);
        expect(data.data.validTill).toBe(validTimeFromMockUp);
      });

      it('should contain only keys of response type', () => {
        checkReturnType(data);
      });
    });
  });
  describe('/:item/sell', () => {
    describe('with correct payload', () => {
      let status: number;
      let data: ResponseType<unknown>;
      const item = 'foo';
      const path = `${item}/sell`;
      const payload = { quantity: 10 };
      beforeEach(async () => {
        const res = await request.post(`/${path}`).send(payload);
        status = res.status;
        data = res.body;
        return '';
      });
      it('should return 201', () => {
        expect(status).toBe(201);
      });

      it('should contain only keys of response type', () => {
        checkReturnType(data);
      });
    });
    describe('With wrong payload', () => {
      let status: number;
      let data: ResponseType<unknown>;
      const item = 'foo';
      const path = `${item}/sell`;
      const payload = {}; // wrong payload
      beforeEach(async () => {
        const res = await request.post(`/${path}`).send(payload);
        status = res.status;
        data = res.body;
        return '';
      });
      it('should return 400', () => {
        expect(status).toBe(400);
      });

      it('should contain only keys of response type', () => {
        checkReturnType(data);
      });
    });
    describe('inventory are expired', () => {
      let status: number;
      let data: ResponseType<unknown>;
      const item = 'foo';
      const path = `${item}/sell`;
      const payload = { quantity: 10 };
      beforeEach(async () => {
        const res = await request.post(`/${path}`).send(payload);
        status = res.status;
        data = res.body;
        return '';
      });
      it('should return 409', () => {
        expect(status).toBe(409);
      });

      it('should contain only keys of response type', () => {
        checkReturnType(data);
      });
    });
  });
});
