'use client';

import { getCookie, setCookie } from 'cookies-next';
import { useState, useCallback } from 'react';

function useUser() {
  // 使用 useState 来存储状态
  const [userState, setUserState] = useState(() => {
    const savedUser = getCookie('user');
    return savedUser ? JSON.parse(String(savedUser)) : null;
  });

  const [tokenState, setTokenState] = useState(() => {
    return getCookie('token') || null;
  });

  // 使用 useCallback 缓存函数
  const getToken = useCallback(() => {
    return tokenState;
  }, [tokenState]);

  const setToken = useCallback((newToken: string) => {
    setCookie('token', newToken);
    setTokenState(newToken);
  }, []);

  const getUser = useCallback(() => {
    return userState;
  }, [userState]);

  const setUser = useCallback((newUser: any) => {
    const userString = JSON.stringify(newUser);
    setCookie('user', userString);
    setUserState(newUser);
  }, []);

  return {
    user: userState,
    token: tokenState,
    getToken,
    setToken,
    getUser,
    setUser,
  };
}

export default useUser;
