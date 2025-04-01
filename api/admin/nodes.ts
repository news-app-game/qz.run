import { request } from '@/tools/net';
import { number } from 'zod';
export const getAreaOptions = <T>() => request.get<T>('/admin/nodes-loc');
export const getNodesList = <T>(data:RequestPageBody) => request.get<T,RequestPageBody>('/admin/nodes', data);
export const createNode = <T, U>(data: U) => request.post<T, U>('/admin/nodes', data);
export const updateNode = <T, U extends {id:string | number}>(data: U) => request.put<T, U  >(`/admin/nodes/${data.id}`, data);
export const deleteNode = <T>(id: number | string) => request.delete<T>(`/admin/nodes/${id}`);
export const getNodeGroupsList = <T>() => request.get<T>('/admin/nodes-groups');
export const createNodeGroup = <T, U>(data: U) => request.post<T, U>('/admin/nodes-groups', data);
export const updateNodeGroup = <T, U extends {id:string | number}>(data: U) => request.put<T, U>(`/admin/nodes-groups/${data.id}`, data);
export const getNodeGrouoInfo = <T>(id: number | string) => request.get<T>(`/admin/nodes-groups/${id}`)
