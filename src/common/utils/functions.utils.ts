import { AxiosError, AxiosResponse } from 'axios';

export function isOkStatusCode(statusCode: number) {
  if (statusCode > 400) return true;
}

export function normalizePhone(phone: string): string {
  if (phone[0] !== '0') phone = phone.split('').reverse().concat('0').reverse().join('');
  return phone;
}

interface IApiSuccessResponse<T = any> {
  message: string;
  isSuccess: boolean;
  data?: T;
}

interface IApiErrorResponse extends Omit<IApiSuccessResponse, 'data'> {}

export type TApiResponse = IApiSuccessResponse & IApiErrorResponse;

export function handleApiSuccessResponse<T = any>(response: AxiosResponse): IApiSuccessResponse<T> {
  let message = response.data?.message;
  const isSuccess = response.status === 200 || response.status === 201;
  const statusCode = response.status || 500;
  const data = response.data;

  if (typeof message !== 'string' || statusCode == 500) message = 'مشکلی پیش آمد. لطفا بعدا امتحان کنید.';

  return { message, isSuccess, data };
}

export function handleApiErrorResponse(error: AxiosError): IApiErrorResponse {
  let message = error.message;
  const isSuccess = error?.response?.status == 200 || error?.response?.status == 201;
  const statusCode = error?.status || error?.response?.status || 500;

  if (typeof message !== 'string' || statusCode == 500) message = 'مشکلی پیش آمد. لطفا بعدا امتحان کنید.';

  return { isSuccess, message };
}
