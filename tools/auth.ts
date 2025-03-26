import { getCookie, setCookie, deleteCookie } from 'cookies-next';

export const getToken = () => {
  return getCookie('token') || null;
};

export const setToken = (token: string) => {
  setCookie('token', token);
};

export const getUser = () => {
  return JSON.parse(String(getCookie('user')));
};

export const setUser = (user: User.User) => {
  setCookie('user', JSON.stringify(user));
};

export const logout = () => {
  deleteCookie('token');
  deleteCookie('user');
};
