import { request } from '@/tools/net';

export const getNoticeList = async (): Promise<API.NoticeListRes> => {
  return request.get('/get-notice-list');
};

export const getNoticeDetail = async (id: number | string): Promise<API.NoticeDetailRes> => {
  return request.get(`/get-notice-detail/${id}`);
};
