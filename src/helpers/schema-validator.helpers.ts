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
  Object.entries(schema).forEach(([Schema, checks]) => {
    const bodyValue = body[Schema];

    /**
     * loop through validity checks for each param
     */
    Object.entries(checks).forEach(([checkName, checkValue]) => {
      /**
       *
       * @param error to add to errors
       */
      const pushError = (error: string) => {
        errors[bodyValue] = errors[bodyValue]
          ? errors[bodyValue].concat([error])
          : [error];
      };

      /**
       * check for required property
       */
      if (checkName === 'required' && checkValue === true) {
        if (!bodyValue) {
          pushError(`${bodyValue} is required`);
        } else if (typeof bodyValue === 'string' && !bodyValue.trim()) {
          pushError(`${bodyValue} is required`);
        }
      }

      /**
       * check for param type
       */
      if (checkName === 'type' && typeof bodyValue !== checkValue) {
        pushError(`${bodyValue} is of wrong type. ${checkValue} expected`);
      }

      /**
       * check for min
       */
      if (checkName === 'min' && bodyValue > checkValue) {
        pushError(`${bodyValue} is less than ${checkValue}`);
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
