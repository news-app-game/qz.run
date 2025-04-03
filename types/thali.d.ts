declare namespace Thali { 
  type PackageNodeGroup = {
    id: number;
    package_id: number;
    node_group_id: number;
    is_time_limited: number;
    is_traffic_limited: number;
    traffic_limit: number;
    traffic_period: number;
    time_limit: number;
    time_period: number;
    node_group: NodeGroup;
  };
  
  // 具体套餐
  type Package = {
    id: number;
    name: string;
    description: string;
    monthly_price: string;
    quarterly_price: string;
    quarterly_total_price: string;
    semi_annually_price: string;
    semi_annually_total_price: string;
    annually_price: string;
    annually_total_price: string;
    is_time_limited: number;
    is_traffic_limited: number;
    time_limit: number;
    time_period: number;
    traffic_limit: number;
    traffic_period: number;
    max_online_devices: number;
    package_node_groups: PackageNodeGroup[];
    user_subscribed: boolean;
    other_benefits: string[];
  };
  
  // 整个 JSON 数据的根类型
  type RootData<T> = {
    site_config:T ;
    packages: Package[];
  };
}