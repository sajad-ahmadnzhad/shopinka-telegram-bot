import { IUserAuthTokens } from '../modules/auth/auth.interface';
import { http } from './http.client';
import { IApiOutput } from '../common/types/api.type';

export async function sendAuthSms(phone: string): Promise<{ isSuccess: boolean }> {
  try {
    const { status } = await http.post('/auth/authenticate', { mobile: phone });

    if (status !== 200 && status !== 201) return { isSuccess: false };

    return { isSuccess: true };
  } catch (error) {
    console.log('Auth Api Error =>', error.response.data.message);
    return { isSuccess: false };
  }
}

export async function checkAuthSms(
  phone: string,
  otpCode: string,
): Promise<{ isSuccess: boolean; tokens?: IUserAuthTokens; isFirst?: boolean }> {
  try {
    const { status, data } = await http.post('/auth/verify-authenticate-otp', { mobile: phone, otp: otpCode });

    if (status !== 200 && status !== 201) return { isSuccess: false };

    const tokens = { refreshToken: data.refreshToken, accessToken: data.accessToken } as IUserAuthTokens;

    return { isSuccess: true, tokens, isFirst: status == 200 ? true : false };
  } catch (error) {
    console.log('Auth Api Error =>', error.response.data.message);
    return { isSuccess: false };
  }
}

export async function refreshToken(refreshToken: string): Promise<IApiOutput & { accessToken?: string }> {
  try {
    const { status, data } = await http.post('/auth/refresh-token', { refreshToken });

    return { accessToken: data.accessToken, statusCode: status, message: data.message };
  } catch (error) {
    console.log('Auth Api (refreshToken) Error =>', error.response.data.message);
    return { statusCode: error.status || error.status_code || error.code || 500, message: error.message || error.response?.data?.message };
  }
}

export async function signout(refreshToken: string, accessToken: string): Promise<{ isSuccess: boolean }> {
  try {
    const { status } = await http.post('/auth/signout', { refreshToken }, { headers: { Authorization: `bearer ${accessToken}` } });

    if (status !== 201) return { isSuccess: false };

    return { isSuccess: true };
  } catch (error) {
    console.log('Auth Api Error =>', error.response.data.message);
    return { isSuccess: false };
  }
}
