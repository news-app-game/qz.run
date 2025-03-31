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
  // 设置3年有效期
  expires.setFullYear(expires.getFullYear() + 3);
  setCookie('user', JSON.stringify(user), { expires });
};

export const logout = () => {
  deleteCookie('user');
};
