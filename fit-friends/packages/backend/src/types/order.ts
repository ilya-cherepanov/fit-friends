import {OrderPaymentMethod, OrderType} from '@fit-friends/core';

export interface Order {
  id?: number;
  type: OrderType;
  price: number;
  quantity: number
  sum: number;
  paymentMethod: OrderPaymentMethod;
  userId: number;
  gymId: number | null;
  trainingId: number | null;
}
