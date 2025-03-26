import { request } from '@/tools/net';

export const getStats = async (): Promise<Stats.StatsRes> => {
  return request.get('/admin/stats');
};
