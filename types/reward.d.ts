declare namespace Reward {
  interface Record {
    id: number;
    type: number;
    type_name: string;
    duration_detail: string;
    created_at: string;
  }
  type Res = Response<Record[]>;
}
