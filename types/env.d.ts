// 环境变量类型声明
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NODE_ENV: 'development' | 'production';
  }
}
