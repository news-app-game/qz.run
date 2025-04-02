import { request } from '@/tools/net';

export const orderPayment = async (data: Order.PayParams): Promise<Order.Res> => {
  return request.post('/order/pay', data);
};
