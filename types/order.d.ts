declare namespace Order {
  interface PayParams {
    package_id: number;
    period: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  }
  interface PayRes {
    checkout_id: string;
  }
  type Res = Response<PayRes>;

  // interface OrderListRes {
  //   id: number;
  //   package_id: number;
  //   period: 'monthly' | 'quarterly' | 'semi_annually' | 'annually';
  //   created_at: string;
  // }
  interface OrderItem {
    id: number;
    price: string;
    status: string;
    package_name: string;
    payment_month: number;
  }
  interface orders {
    data: OrderItem[];
    meta: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  }
  interface UserPackage {
    package: Omit<Package.Item, 'user_subscribed' | 'other_benefits' | 'package_node_groups'>;
    created_at: string;
    end_date: string;
    id: number;
    package_id: number;
    start_date: string;
    status: string;
    updated_at: string;
    user_id: number;
  }
  type OrderListRes = Response<{
    orders: orders;
    user_packages: UserPackage[];
  }>;
}
