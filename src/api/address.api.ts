import { handleApiErrorResponse, handleApiSuccessResponse, TApiResponse } from '../common/utils/functions.utils';
import { IAddressInfo } from '../modules/address/address.interface';
import { http } from './http.client';

export async function createAddress(accessToken: string, addressData: IAddressInfo): Promise<TApiResponse> {
  try {
    const response = await http.post('/address/', { ...addressData }, { headers: { Authorization: `bearer ${accessToken}` } });

    return handleApiSuccessResponse(response);
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

export async function getAllAddresses(accessToken: string): Promise<{ isSuccess: boolean; data?: (IAddressInfo & { id: number })[] }> {
  try {
    const { status, data } = await http.get('/address/?page=1&take=1000', { headers: { Authorization: `bearer ${accessToken}` } });

    if (status !== 200) return { isSuccess: false };

    return { isSuccess: true, data: data.items };
  } catch (error) {
    console.log(error.response.data.message);
    return { isSuccess: false };
  }
}

export async function getOneAddress(
  accessToken: string,
  addressId: number,
): Promise<{ isSuccess: boolean; data?: IAddressInfo & { id: number } }> {
  try {
    const { status, data } = await http.get(`/address/${addressId}`, { headers: { Authorization: `bearer ${accessToken}` } });

    if (status !== 200) return { isSuccess: false };

    return { isSuccess: true, data: data };
  } catch (error) {
    console.log(error.response.data.message);
    return { isSuccess: false };
  }
}

export async function removeAddress(accessToken: string, addressId: number): Promise<{ isSuccess: boolean }> {
  try {
    const { status } = await http.delete(`/address/${addressId}`, { headers: { Authorization: `bearer ${accessToken}` } });

    if (status !== 200) return { isSuccess: false };

    return { isSuccess: true };
  } catch (error) {
    console.log(error.response.data.message);
    return { isSuccess: false };
  }
}

export async function setDefaultAddress(accessToken: string, addressId: number): Promise<{ isSuccess: boolean; address?: IAddressInfo }> {
  try {
    const { status, data } = await http.patch(`/address/${addressId}/set-default`, null, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    if (status !== 200) return { isSuccess: false };

    return { isSuccess: true, address: data.address };
  } catch (error) {
    console.log(error.response.data.message);
    return { isSuccess: false };
  }
}

export async function updateAddress(
  accessToken: string,
  addressId: number,
  addressData: Partial<IAddressInfo>,
): Promise<{ isSuccess: boolean; address?: IAddressInfo }> {
  try {
    const { status, data } = await http.patch(`/address/${addressId}`, addressData, {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    if (status !== 200) return { isSuccess: false };

    return { isSuccess: true, address: data.address };
  } catch (error) {
    console.log(error.response.data.message);
    return { isSuccess: false };
  }
}
