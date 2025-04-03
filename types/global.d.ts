
type RequestPageBody = {
  page: number;
  per_page: number;
}
type GlobalOptions<T = string> = {
  label: string;
  value: T;
};