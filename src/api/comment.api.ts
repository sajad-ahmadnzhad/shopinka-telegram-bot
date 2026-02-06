import { handleApiErrorResponse, handleApiSuccessResponse, normalizeQuery, TApiResponse } from '../common/utils/functions.utils';
import { http } from './http.client';

export async function getComments(filters: Record<string, string>): Promise<TApiResponse> {
  try {
    const query = normalizeQuery(filters);

    const response = await http.get(`/comment${query}`);

    return handleApiSuccessResponse(response);
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
