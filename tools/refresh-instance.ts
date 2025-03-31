import { RefreshToken } from './refresh-token';
import { logout } from './auth';
import axios from 'axios';
export const refreshInstance = new RefreshToken({
  refreshUrl: `${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`,
  cookiePrefix: '',
  fetchFunction: async (url: string, token: string) => {
    const res = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status !== 200) {
      throw new Error('refresh token failed');
    }
    if (res.data.code !== 200) {
      throw new Error(res.data.message);
    }
    return res.data.data;
  },
  onLogout: () => {
    logout();
  },
});
