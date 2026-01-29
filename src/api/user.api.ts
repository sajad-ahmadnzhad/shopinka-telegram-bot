import { http } from './http.client';

export async function editProfile(accessToken: string, fullName: string): Promise<{ isSuccess: boolean }> {
  try {
    const { status } = await http.patch('/user/profile', { fullName }, { headers: { Authorization: `bearer ${accessToken}` } });

    if (status !== 200) return { isSuccess: false };

    return { isSuccess: true };
  } catch (error) {
    console.log('User Api Error =>', error.response.data.message);
    return { isSuccess: false };
  }
}

export async function getMe(accessToken: string): Promise<{ isSuccess: boolean; data?: Record<string, any> }> {
  try {
    const { status, data } = await http.get('/user/me', { headers: { Authorization: `bearer ${accessToken}` } });

    if (status !== 200) return { isSuccess: false };

    return { isSuccess: true, data };
  } catch (error) {
    console.log('User Api Error =>', error.response.data.message);
    return { isSuccess: false };
  }
}
