/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { ResponseStatus } from '../types/response.types';

export function validator(
  this: ValidatorPayload,
  req: Request,
  res: Response,
  next: () => void
) {
  try {
    const body = req.body;
    if (body) {
      if (!this.fields) {
        throw new Error('Validator field was not bind');
      }
      const fields = this.fields;
      const errors: Record<string, string[]> = {};

      Object.entries(fields).forEach(([field, checks]) => {
        const bodyValue = body[field];
        Object.entries(checks).forEach(([checkName, checkValue]) => {
          const pushError = (error: string) => {
            errors[bodyValue] = errors[bodyValue]
              ? errors[bodyValue].concat([error])
              : [error];
          };
          if (checkName === 'required' && checkValue === true) {
            if (!bodyValue) {
              pushError(`${bodyValue} is required`);
            } else if (typeof bodyValue === 'string' && !bodyValue.trim()) {
              pushError(`${bodyValue} is required`);
            }
          }

          if (checkName === 'type' && typeof bodyValue !== checkValue) {
            pushError(`${bodyValue} is of wrong type. ${checkValue} expected`);
          }

          if (checkName === 'max' && bodyValue > checkValue) {
            pushError(`${bodyValue} is greater than ${checkValue}`);
          }
        });
      });

      if (Object.keys(errors).length > 0) {
        res.sendStatus(400).json({
          message: 'validation error',
          data: errors,
          meta: {},
          status: ResponseStatus.Error
        });
      }
    }
    next();
  } catch (e: any) {
    res.sendStatus(500).json({
      message: 'internal server error',
      data: null,
      meta: {},
      status: ResponseStatus.Error
    });
  }
}

interface ValidatorPayload {
  fields: {
    [t: string]: CheckerType;
  };
}

interface CheckerType {
  type?: string;
  max?: number;
  required?: boolean;
}
