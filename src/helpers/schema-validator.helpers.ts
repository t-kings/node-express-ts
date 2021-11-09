/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description Validates body against validation schema
 */

/**
 *
 * @param schema validation schema to check against
 * @param body body to validate
 * @returns
 */
export const schemaValidator = (
  schema: SchemaType,
  body: Record<string, any>
) => {
  const errors: Record<string, string[]> = {};

  /**
   * loop through entries of schema to get params and checks
   */
  Object.entries(schema).forEach(([field, checks]) => {
    let bodyValue = body[field];
    if (bodyValue === 'string') {
      bodyValue = !bodyValue.trim();
    }
    /**
     * loop through validity checks for each param
     */
    Object.entries(checks).forEach(([checkName, checkValue]) => {
      /**
       *
       * @param error to add to errors
       */
      const pushError = (error: string) => {
        errors[field] = errors[field] ? errors[field].concat([error]) : [error];
      };

      /**
       * check for required property
       */
      if (checkName === 'required' && checkValue && !bodyValue) {
        pushError(`${field} is required`);
      }

      /**
       * check for param type
       */
      if (checkName === 'type' && typeof bodyValue !== checkValue) {
        pushError(`${field} is of wrong type. ${checkValue} expected`);
      }

      /**
       * check for min
       */
      if (checkName === 'min' && bodyValue < checkValue) {
        pushError(`${field} is less than min : ${checkValue}`);
      }
    });
  });
  return errors;
};

export interface SchemaType {
  [t: string]: CheckerType;
}

interface CheckerType {
  type?: string;
  min?: number;
  required?: boolean;
}
