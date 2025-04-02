declare namespace Packages {
  // type Params = FormData;
  interface NodeGroup {
    id: number;
    package_id: number;
    node_group_id: number;
    is_time_limited: number;
    is_traffic_limited: number;
    traffic_limit: number;
    traffic_period: 0 | 1 | 2; // 0对应天 1对应周 2对应月
    time_limit: number;
    time_period: 0 | 1 | 2; // 0对应天 1对应周 2对应月
    node_group: {
      id: number;
      name: string;
      nodes: any[];
    };
  }
  interface Item {
    id: number;
    name: string;
    description: string;
    monthly_price: string;
    quarterly_price: string;
    semi_annually_price: string;
    annually_price: string;
    time_limit: number;
    time_period: 0 | 1 | 2; // 0对应天 1对应周 2对应月
    traffic_limit: number;
    traffic_period: 0 | 1 | 2; // 0对应天 1对应周 2对应月
    max_online_devices: number;
    package_node_groups: NodeGroup[];
    user_subscribed: boolean;
    other_benefits: string[];
  }
  interface SiteConfig {
    annually_discount: number;
    quarterly_discount: number;
    semi_annually_discount: number;
  }
  type Res = Response<{
    packages: Item[];
    site_config: SiteConfig;
  }>;
}
