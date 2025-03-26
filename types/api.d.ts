declare namespace API {
  interface Response<T = any> {
    code: number;
    data: T;
    message: string;
    errors?: Record<string, string[]>;
  }

}
