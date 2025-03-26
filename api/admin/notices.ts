import { request } from '@/tools/net';

export const getNoticeList = async (params: API.AdminNoticeParams): Promise<API.AdminNoticeRes> => {
  return request.get(`/admin/notices?page=${params.page}&per_page=${params.per_page}`);
};

export const deleteNotice = async (id: number): Promise<API.AdminNoticeDeleteRes> => {
  return request.delete(`/admin/notices/${id}`);
};

// 编辑
export const editNotice = async (id: number, params: API.AdminNoticeCEParams): Promise<API.AdminNoticeCERes> => {
  return request.put(`/admin/notices/${id}`, params);
};

// 创建
export const createNotice = async (params: API.AdminNoticeCEParams): Promise<API.AdminNoticeCERes> => {
  return request.post(`/admin/notices`, params);
};
