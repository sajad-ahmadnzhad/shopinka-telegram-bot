import { handleApiErrorResponse, handleApiSuccessResponse, normalizeQuery, TApiResponse } from '../common/utils/functions.utils';
import { http } from './http.client';

export async function getProducts(filter: Record<string, string> = {}): Promise<TApiResponse> {
  try {
    const query = normalizeQuery(filter);

    const response = await http.get(`/product${query}`);

    return handleApiSuccessResponse(response);
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

export async function getOneProduct(productId: number): Promise<TApiResponse> {
  try {
    const response = await http.get(`/product/${productId}`);

    return handleApiSuccessResponse(response);
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
