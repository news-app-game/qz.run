declare namespace Order {
  interface PayParams {
    package_id: number;
    period: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  }
  interface PayRes {
    checkout_id: string;
  }
  type Res = Response<PayRes>;
}
