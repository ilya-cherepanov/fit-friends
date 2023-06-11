import {SortingOrder} from '@fit-friends/core';


export interface OrdersQuery {
  page?: number
  sortBySum?: SortingOrder;
  sortByQuantity?: SortingOrder;
}
