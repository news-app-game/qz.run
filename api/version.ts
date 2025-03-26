import { request } from '@/tools/net';

export const getVersionList = async (): Promise<Version.Res> => {
  return request.get('/version-list');
};

