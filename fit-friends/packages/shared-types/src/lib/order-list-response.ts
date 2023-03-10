import {OrderResponse} from './order-response';

export interface OrderListResponse {
  currentPage: number;
  totalPages: number;
  orders: OrderResponse[];
}
