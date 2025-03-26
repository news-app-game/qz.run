import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { isClient } from '@/tools/check';
import { refreshInstance } from './refresh-instance';

// 创建axios实例
const instance: AxiosInstance = axios.create({
  // 设置基础URL，建议从环境变量获取
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050',
  // 请求超时时间
  timeout: 10000,
  // 设置默认请求头为JSON格式
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    Accept: 'application/json',
  },
  // 确保请求数据会被转换为JSON字符串
  transformRequest: [
    (props?: { data: unknown }) => {
      const data = props?.data || props;
      if (data instanceof FormData) {
        return data;
      }
      return JSON.stringify(data);
    },
  ],
  // 确保响应数据会被解析为JSON
  transformResponse: [
    (data) => {
      if (typeof data === 'string') {
        try {
          return JSON.parse(data);
        } catch {
          return data;
        }
      }
      return data;
    },
  ],
});

const tokenLoading = {
  value: false,
  subscribe: (callback: (value: boolean) => void) => {
    callback(tokenLoading.value);
  },
  setValue: (value: boolean) => {
    tokenLoading.value = value;
  },
};

// 请求拦截器
instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 开发使用
    if (process.env.NEXT_PUBLIC_TOKEN) {
      const newToken = process.env.NEXT_PUBLIC_TOKEN;
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        return config;
      }
    }

    // 如果不是服务器，则直接从 cookie 获取 token
    if (isClient) {
      const token = await refreshInstance.getToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    const { data, status } = response;

    // 可以根据后端返回的状态码或其他标识进行统一处理
    if (status >= 200 && status < 300) {
      return data;
    }

    // 处理其他状态码
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  (error) => {
    if (error.response) {
      // 对响应错误做点什么
      switch (error.response.status) {
        case 401:
          if (isClient) {
            refreshInstance.logout();
          }
          break;
        case 403:
          // 权限不足
          // 输出请求路径
          console.error('权限不足', error.response.config.url);
          // 返回上一页
          break;
        case 404:
          // 请求不存在
          console.error('请求的资源不存在');
          break;
        case 500:
          // 服务器错误
          console.error('服务器错误');
          break;
        default:
          console.error(`其他错误：${error.response.status}`);
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已经发出，但没有收到响应
      console.error('网络错误，请检查您的网络连接');
    } else {
      // 请求配置发生的错误
      console.error('请求错误:', error.message);
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
export const request = {
  get: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => instance.get<T, T>(url, { ...config, params: data }),

  post: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => instance.post<T, T>(url, data, config),

  put: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => instance.put<T, T>(url, data, config),

  delete: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => instance.delete<T, T>(url, { ...config, data }),

  patch: <T = unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig) => instance.patch<T, T>(url, data, config),
};

// 导出实例和请求方法
export default request;
