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
    created_at: string;
    id: number;
    order_id: string;
    package_days: number;
    package_id: number;
    pay_method: string;
    pay_price: number;
    price: number;
    status: number;
    updated_at: string;
    user_id: number;
  }
  interface orders {
    current_page: number;
    data: OrderItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
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
