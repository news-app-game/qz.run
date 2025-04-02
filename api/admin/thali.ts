import { request } from '@/tools/net';

export const getThaliList = () => request.get("/admin/packages")
export const createThali = (data: any) => request.post("/admin/packages", data)
export const updateThali = (data: any) => request.put(`/admin/packages/${data.id}`, data)
export const setDiscount = (data: any) => request.post(`/admin/packages/discount-settings`, data)
export const getThaliInfo = (id:any) => request.get(`/admin/packages/${id}`)
// export 