import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const getUser = () => {
  const userStr = getCookie('user');
  if (!userStr) {
    return null;
  }
  return JSON.parse(String(userStr));
};

export const setUser = (user: User.User) => {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30);
  setCookie('user', JSON.stringify(user), { expires });
};

export const logout = () => {
  deleteCookie('user');
};
