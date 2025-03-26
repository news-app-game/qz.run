import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const getUser = () => {
  return JSON.parse(String(getCookie('user')));
};

export const setUser = (user: User.User) => {
  setCookie('user', JSON.stringify(user));
};

export const logout = () => {
  deleteCookie('user');
};
