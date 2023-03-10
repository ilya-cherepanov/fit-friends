import {OrderPaymentMethod, OrderType} from '@fit-friends/core';

export interface OrderResponse {
  id: number;
  type: OrderType;
  price: number;
  quantity: number;
  sum: number;
  paymentMethod: OrderPaymentMethod;
  createdAt: string;
}
