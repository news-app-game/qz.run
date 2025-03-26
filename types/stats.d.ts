declare namespace Stats {
  interface Item {
    id: number;
    title: string;
    content: string;
    type: number;
    status: boolean;
    start_at: string;
    end_at: string;
    created_at: string;
    updated_at: string;
  }
  
  type StatsRes = Response<Item[]>;

  type StatsDetailRes = Response<Item>;
}
