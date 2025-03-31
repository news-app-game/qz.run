import { RefreshToken } from './refresh-token';
import { logout } from './auth';
export const refreshInstance = new RefreshToken({
  refreshUrl: `${process.env.NEXT_PUBLIC_API_URL}/user/refresh-token`,
  cookiePrefix: '',
  onLogout: () => {
    logout();
  },
});
