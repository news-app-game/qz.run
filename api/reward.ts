import { request } from '@/tools/net';
// 获取奖励记录
export const getRewardRecords = async (): Promise<Reward.Res> => {
  return request.get('/user/reward-records');
};
