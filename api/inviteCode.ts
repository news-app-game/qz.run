import { request } from '@/tools/net';

export const getInviteCode = async (): Promise<Invite.Res> => {
  return request.get('/invite-code');
};
