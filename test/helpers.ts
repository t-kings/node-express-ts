import { ResponseStatus, ResponseType } from '../src/types/response.types';

/**
 * @description reusable check to confirm that interceptor was called in the route
 * @param path path test is being ran for
 * @param method method path of the test being ran
 * @param data return data
 */
export const checkReturnType = (
  path: string,
  method: string,
  data: ResponseType<unknown>
) => {
  describe(`/${path} (${method}) returned data should be of response type`, () => {
    /**
     * @param data
     */
    it('should contain only keys of response type', () => {
      const keys = Object.keys(data);
      const expectedKeys = ['status', 'meta', 'message', 'data'];
      keys.forEach((key) => {
        expect(expectedKeys).toContain(key);
      });
    });

    /**
     * @key message
     */
    it('should contain key {message} of type string', () => {
      expect(data?.message).toBeDefined();
      expect(typeof data?.message).toBe('string');
    });

    /**
     * @key data
     */
    it('should contain key {data}', () => {
      expect(data?.data).toBeDefined();
    });

    /**
     * @key status
     */
    it('should contain key {status}, it must be error, success', () => {
      expect(data?.status).toBeDefined();
      expect(Object.values(ResponseStatus)).toContain(data?.status);
    });

    /**
     * @key meta
     */
    it('should contain key {meta}', () => {
      expect(data?.meta).toBeDefined();
      expect(typeof data?.meta).toBe('object');
    });
  });
};

describe('Common tests for CommonService implementations', () => {
  test('should be used per implementation', () => {
    //
  });
});
