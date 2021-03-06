/**
 * @description body parser middleware
 */

import { Request, Response } from 'express';
import { StringDecoder } from 'string_decoder';
import { httpResponse } from '../utils';

/**
 *
 * @param req from express middleware bind
 * @param res from express middleware bind
 * @param next from express middleware bind
 */
export const bodyParser = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  try {
    const parser = () => {
      return new Promise((resolve, reject) => {
        try {
          // Get the payload,if any
          const decoder = new StringDecoder('utf-8');
          let buffer = '';
          req.on('data', function (data) {
            buffer += decoder.write(data);
          });
          req.on('end', function () {
            buffer += decoder.end();
            // Construct the data object to send to the handler
            try {
              resolve(JSON.parse(buffer || '{}'));
            } catch (error) {
              const keyValueStrings = buffer.split('&');
              const body: any = {};
              keyValueStrings.forEach((keyValueString) => {
                body[keyValueString.split('=')[0]] = !isNaN(
                  keyValueString.split('=')[1] as unknown as number
                )
                  ? parseFloat(keyValueString.split('=')[1])
                  : keyValueString.split('=')[1];
              });
              resolve(body);
            }
          });
        } catch (error) {
          reject(error);
        }
      });
    };

    const data = await parser();
    req.body = data;

    next();
  } catch (e: any) {
    return httpResponse.internalServerError(res);
  }
};
