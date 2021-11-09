/**
 * @description Unit Test for schemaValidator
 */
import { schemaValidator } from './schema-validator.helpers';

describe('Schema Validator', () => {
  const schema = {
    quantity: {
      required: true,
      type: 'number'
    },
    expiry: {
      required: true,
      type: 'number',
      min: new Date().getTime()
    }
  };

  const body = {
    quantity: 4000,
    expiry: new Date().getTime() + 5 * 60 * 1000 // add 5 minutes
  };

  it('should return empty object if body matches schema', () => {
    const errors = schemaValidator(schema, body);
    expect(Object.values(errors).length).toBe(0);
  });

  it('should return object containing field that fails', () => {
    const errors = schemaValidator(schema, { ...body, quantity: '4000' }); // passing string in place of number
    expect(errors.quantity).toBeDefined();
  });

  it('failing error field should be an array', () => {
    const errors = schemaValidator(schema, { ...body, quantity: '4000' }); // passing string in place of number
    expect(typeof errors.quantity).toBe('array');
  });

  it('error message should be accurate to failing schema part failing', () => {
    let errors = schemaValidator(schema, { ...body, quantity: '4000' }); // passing string in place of number
    expect(errors.quantity).toContain(
      'quantity is of wrong type. number expected'
    );

    const expiry = new Date().getTime() + 5 * 60 * 1000;
    errors = schemaValidator(schema, {
      ...body,
      expiry
    }); // removed 5 minutes to make expiry time passed

    expect(errors.quantity[0].includes(`${expiry} is less than `)).toBeTruthy();

    errors = schemaValidator(schema, {
      expiry
    }); // didn't pass required quantity

    expect(errors.quantity).toContain('quantity is required');
  });
});
