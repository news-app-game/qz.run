import { request } from '@/tools/net';

export const feedback = async (data: Feedback.Params): Promise<Feedback.Res> => {
  return request.post('/feedback', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
