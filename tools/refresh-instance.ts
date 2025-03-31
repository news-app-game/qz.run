import { RefreshToken } from './refresh-token';
import { logout } from './auth';
export const refreshInstance = new RefreshToken({
  refreshUrl: '/user/refresh-token',
  cookiePrefix: '',
  onLogout: () => {
    logout();
  },
});
