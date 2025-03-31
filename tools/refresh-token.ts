export class RefreshToken {
  // 单例模式
  static instance: RefreshToken;
  // cookie前缀
  private cookiePrefix?: string;
  // 当前token
  private token: string;
  // 当前token创建时间
  private tokenCreateTime: number;
  // 当前token过期时间
  private tokenExpireTime: number;
  // 刷新token的url
  private refreshUrl: string;
  // 刷新token的fetch函数
  private fetchFunction: <T = unknown>(url: string, token: string) => Promise<T>;
  // 退出登录的回调函数
  private onLogout?: () => void;
  // 是否正在刷新token
  private tokenLoading = {
    value: false,
    subscribeList: [] as ((value: boolean) => void)[],
    subscribe: (callback: (value: boolean) => void) => {
      this.tokenLoading.subscribeList.push(callback);
    },
    unsubscribe: (callback: (value: boolean) => void) => {
      this.tokenLoading.subscribeList = this.tokenLoading.subscribeList.filter((item) => item !== callback);
    },
    setValue: (value: boolean) => {
      this.tokenLoading.value = value;
      this.tokenLoading.subscribeList.forEach((callback) => callback(value));
    },
  };

  private TOKEN_NAME = 'token';
  private TOKEN_CREATE_TIME_NAME = 'token-created-time';
  private TOKEN_EXPIRE_TIME_NAME = 'token-expires';

  /**
   *
   * @param {Object} options
   * @param {string} options.refreshUrl - 刷新token的url
   * @param {Function} options.fetchFunction - 刷新token的fetch函数
   * @param {Function} options.onLogout - 退出登录的回调函数
   * @param {string} options.cookiePrefix - cookie前缀
   * @param {boolean} options.disableInstance - 是否禁止单例模式
   */
  constructor({
    refreshUrl,
    fetchFunction,
    onLogout,
    cookiePrefix,
    disableInstance,
  }: {
    refreshUrl: string;
    fetchFunction?: RefreshToken['fetchFunction'];
    onLogout?: () => void;
    cookiePrefix?: string;
    disableInstance?: boolean;
  }) {
    this.cookiePrefix = cookiePrefix;
    this.refreshUrl = refreshUrl;
    this.fetchFunction = fetchFunction || this.defaultFetchFunction;
    this.onLogout = onLogout;
    this.token = RefreshToken.getCookie(this.addCookiePrefix(this.TOKEN_NAME)) || '';
    this.tokenExpireTime = Number(RefreshToken.getCookie(this.addCookiePrefix(this.TOKEN_EXPIRE_TIME_NAME))) || 0;
    this.tokenCreateTime = Number(RefreshToken.getCookie(this.addCookiePrefix(this.TOKEN_CREATE_TIME_NAME))) || 0;
    this.initCheck();
    if (disableInstance !== true && RefreshToken.instance && refreshUrl === RefreshToken.instance.getRefreshUrl()) {
      return RefreshToken.instance;
    }
    RefreshToken.instance = this;
  }

  // 默认检查是否过期
  private initCheck() {
    if (this.tokenExpireTime < new Date().getTime()) {
      this.logout();
    }
  }

  // 默认的fetch函数
  private defaultFetchFunction(url: string, token: string) {
    return fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    }).then((res) => res.json());
  }

  // cookie添加前缀
  private addCookiePrefix(name: string) {
    return `${this.cookiePrefix ? `${this.cookiePrefix}-` : ''}${name}`;
  }

  /**
   * 获取token
   */
  public async getToken(): Promise<string | null> {
    // 如果失效或token为空，返回null
    if (!this.token || this.tokenExpireTime < new Date().getTime()) {
      this.logout();
      return null;
    }
    // 如果创建时间距离当前时间大于10700000ms(3小时-100s)，则需要刷新token
    if (this.tokenCreateTime < new Date().getTime() - 150000) {
      // 如果正在刷新token，则等待刷新完成
      if (this.tokenLoading.value) {
        await new Promise((resolve) => {
          const callback = (value: boolean) => {
            // 如果刷新完成，则返回token
            if (!value) {
              resolve(true);
              this.tokenLoading.unsubscribe(callback);
            }
          };
          // 订阅刷新完成事件
          this.tokenLoading.subscribe(callback);
        });
        return this.token;
      }
      // 设置正在刷新token
      this.tokenLoading.setValue(true);
      try {
        const res = await this.fetchFunction<{ token: string; expire: number }>(this.refreshUrl, this.token);
        // 如果刷新成功，则设置token
        if (res.token) {
          this.setToken(res.token, res.expire);
          this.tokenLoading.setValue(false);
          return res.token;
        } else {
          this.logout();
        }
      } catch {
        // 如果刷新失败，则退出登录
        this.logout();
      } finally {
        this.tokenLoading.setValue(false);
      }
      return null;
    }
    return this.token;
  }

  /**
   * 获取token值
   */
  public getTokenValue() {
    return this.token;
  }

  /**
   * 获取token创建时间
   */
  public getTokenCreateTime() {
    return this.tokenCreateTime;
  }

  /**
   * 获取token过期时间
   */
  public getTokenExpireTime() {
    return this.tokenExpireTime;
  }

  /**
   * 获取刷新token的url
   */
  public getRefreshUrl() {
    return this.refreshUrl;
  }

  // 登录后设置token
  public setToken(token: string, expireTime?: number | string) {
    this.token = token;
    this.tokenCreateTime = new Date().getTime();
    // 默认过期时间30天
    this.tokenExpireTime = new Date().getTime() + (expireTime ? Number(expireTime) : 1000 * 60 * 60 * 24 * 30);
    RefreshToken.setCookie(this.addCookiePrefix(this.TOKEN_NAME), token, this.tokenExpireTime);
    RefreshToken.setCookie(this.addCookiePrefix(this.TOKEN_CREATE_TIME_NAME), this.tokenCreateTime.toString(), this.tokenExpireTime);
    RefreshToken.setCookie(this.addCookiePrefix(this.TOKEN_EXPIRE_TIME_NAME), this.tokenExpireTime.toString(), this.tokenExpireTime);
  }

  /**
   * 退出登录
   * @param {Object} options
   * @param {boolean} options.disableLogout - 是否禁止继续调用onLogout，防止循环调用
   */
  public logout({
    disableLogout,
  }: {
    disableLogout?: boolean;
  } = {}) {
    this.token = '';
    this.tokenCreateTime = 0;
    this.tokenExpireTime = 0;
    RefreshToken.deleteCookie(this.addCookiePrefix(this.TOKEN_NAME));
    RefreshToken.deleteCookie(this.addCookiePrefix(this.TOKEN_CREATE_TIME_NAME));
    RefreshToken.deleteCookie(this.addCookiePrefix(this.TOKEN_EXPIRE_TIME_NAME));
    if (!disableLogout) {
      this.onLogout?.();
    }
  }

  /**
   * 判断是否是登录状态
   */
  public isLogin() {
    return this.token && this.tokenCreateTime && this.tokenExpireTime > new Date().getTime();
  }

  /**
   * 获取cookie
   */
  static getCookie(name: string) {
    if (!this.checkDocument()) {
      return null;
    }
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(';').shift();
  }

  /**
   * 设置cookie
   */
  static setCookie(name: string, value: string, expires?: number) {
    if (!this.checkDocument()) {
      return null;
    }
    document.cookie = `${name}=${value}; path=/${expires ? `; expires=${new Date(expires).toUTCString()}` : ''}`;
  }

  /**
   * 删除cookie
   */
  static deleteCookie(name: string) {
    if (!this.checkDocument()) {
      return null;
    }
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }

  /**
   * 检查是否是浏览器环境
   */
  private static checkDocument() {
    if (typeof document === 'undefined') {
      return false;
    }
    return true;
  }
}

/**
 * example
 * const refreshToken = new RefreshToken({
 *   refreshUrl: '/api/auth/refresh-token',
 *   cookiePrefix: 'news',
 *   fetchFunction: (url, token) => {
 *     return axios.post(url, { token });
 *   },
 *   onLogout: () => {
 *     console.log('token过期/刷新失败，退出登录');
 *   },
 * });
 *
 * // 获取token
 * const token = await refreshToken.getToken();
 *
 * // 退出登录
 * refreshToken.logout();
 */
/**
 *
 * 基本流程：
 * 1. 登录获取token，调用refreshToken.setToken设置token
 * 2. 每次请求调用refreshToken.getToken（fetch方法需要防止重复请求）获取token
 * 3. 如果token过期，则调用fetchFunction刷新token （方法内部处理）
 * 4. 如果刷新失败，则调用logout退出登录 （额外功能需要传入onLogout）
 * 5. 如果刷新成功，则调用refreshToken.setToken刷新token
 */
