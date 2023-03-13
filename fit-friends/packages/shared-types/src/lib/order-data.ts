import {OrderPaymentMethod, OrderType} from '@fit-friends/core';


export interface OrderData {
  type: OrderType;
  quantity: number;
  id: number;
  paymentMethod: OrderPaymentMethod;
}
