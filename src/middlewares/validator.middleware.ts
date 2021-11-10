/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * @description body payload Validator middleware
 */

import { Request, Response } from 'express';
import {
  SchemaType,
  schemaValidator
} from '../helpers/schema-validator.helpers';
import { httpResponse } from '../utils';

/**
 *
 * @param this from route bind
 * @param req from express middleware bind
 * @param res from express middleware bind
 * @param next from express middleware bind
 */
export function validator(
  this: ValidatorPayload,
  req: Request,
  res: Response,
  next: () => void
) {
  try {
    const body = req.body;

    /**
     * this validates just request body
     */
    if (body) {
      /**
       * throw error if schema was not bind
       */
      if (!this.schema) {
        throw new Error('Validator Schema was not bind');
      }
      const schema = this.schema;

      const errors = schemaValidator(schema, req.body);

      if (Object.keys(errors).length > 0) {
        /**
         * return with error code 400
         */
        return httpResponse.validationError(res, {
          data: errors
        });
      }
    }
    next();
  } catch (e: any) {
    return httpResponse.internalServerError(res);
  }
}

interface ValidatorPayload {
  schema: SchemaType;
}
