/**
 * @description custom types of response
 */

export interface ResponseType<T> {
  data: T;
  message: string;
  meta: MetaType;
  status: ResponseStatus;
}

export enum ResponseStatus {
  Error = 'error',
  Success = 'success'
}

export interface MetaType {
  pagination?: {
    page: number;
    total: number;
    count: number; // number of documents in response
  };
}
