import { request } from '@/tools/net';

export const getPackages = async (): Promise<Packages.Res> => {
  return request.get('/packages');
};
