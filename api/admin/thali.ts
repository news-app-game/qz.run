import { request } from '@/tools/net';

export const getThaliList = <T>() => request.get<T>("/admin/packages")
export const createThali = (data: any) => request.post("/admin/packages", data)
export const updateThali = (data: any) => request.put(`/admin/packages/${data.id}`, data)
export const setDiscount = <T>(data:T) => request.post(`/admin/packages/discount-settings`, data)
export const getThaliInfo = (id: any) => request.get(`/admin/packages/${id}`)
export const deleteThali = (id:any) => request.delete(`/admin/packages/${id}`)